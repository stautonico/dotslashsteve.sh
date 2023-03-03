import {debug, print} from "./util/io";
import {Buffer} from "./util/buffer";
import {cd, history, pwd, passthrough, custom_export, unset} from "./terminal_builtins";
import {
    CURSOR, decrementFormattingCounter,
    FORMATTING_COUNTER,
    OUTPUT_BUFFER,
    OUTPUT_FRAME,
    PASS_THROUGH_INDICATOR, resetFormattingCounter,
} from "./util/globals";
import {make_backslash_at, make_backslash_d, make_backslash_capital_t, make_backslash_t} from "./util/date";
import {computer} from "./util/globals";
import {escape_html} from "./util/html";
import {KeyboardShortcut} from "./util/keyboard";
import {geteuid} from "./lib/unistd";

/*
The way the terminal works:
There are 3 main buffers involved in the terminal:
1. The input buffer : This is the buffer that stores what the user has typed in/is currently typing in
2. The output buffer : This is an array of strings. Each string is a line of output.
3. The line output buffer : This is the same as the input buffer, but it is used to print what the user has typed in.
    The reason this is a separate buffer is so we can type characters in the input buffer without them being printed (such as the sudo password)

How input is handled:
1. The user types in a character
2. The character is added to the input buffer
3. The character is added to the line output buffer
4. The line output buffer is printed to the screen
5. The cursor is moved to the end of the line output buffer
   5b. The cursor is an element in the line output buffer, so it can be moved around by adding/removing characters from the line output buffer
6. The input buffer is printed to the screen
7. When the user presses enter, the input is handled
8. The input buffer is cleared
9. The output line buffer is moved to the output buffer
10. The line output buffer is cleared

 */

const NON_PRINTABLES = ["Control", "Shift", "Alt", "Super", "OS", "Meta", "Escape", "Delete",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
    "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24",
    "PrintScreen", "PageUp", "PageDown", "Insert", "Home", "End", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "CapsLock", "NumLock", "ScrollLock", "Pause", "ContextMenu", "AudioVolumeMute", "AudioVolumeDown", "AudioVolumeUp",
    "MediaTrackNext", "MediaTrackPrevious", "MediaPlay", "MediaStop", "MediaPlayPause", "LaunchMail", "SelectTask",
    "LaunchApp1", "LaunchApp2", "BrowserSearch", "BrowserHome", "BrowserBack", "BrowserForward", "BrowserStop", "BrowserRefresh"];


export class Terminal {
    // The buffer that stores what the user has typed in/is currently typing in
    // This is used to be able to backspace and use the arrow keys to navigate the buffer.
    // Each sub-buffer is an inputted line
    // input_buffer: Buffer<Buffer<string>>;
    input_buffer: Buffer<string>;
    output_line_buffer: Buffer<string>;

    // Whether the user is currently typing in something (used to control the cursor blinking)
    typing = false;

    // The time left before the user isn't typing anymore. This is used to make the cursor blink.
    keydown_timeout = 0;

    // Keeps track of how far back the user has pressed the arrow keys to navigate the command history
    input_index = -1;

    pressed_buttons: { [button: string]: boolean } = {};

    // Pass through mode allows key presses to act as they normally would (in the browser)
    // instead of being handled by the terminal
    pass_through_enabled = false;

    keyboard_shortcuts: KeyboardShortcut[] = [];

    // After we handle a shortcut, all modifiers will be forced to be released
    // however, the non-modifier key will still be spammed into the terminal.
    // This variable will be set to the key the terminal is waiting to be released
    // Once this key is released, the terminal can resume recieving input
    waiting_for_release? = "";

    cursor_position = 0;

    /* List of builtins to implement
    TODO: alias: Create an alias for a command
    DONE: cd: Change the current working directory
    TODO: chdir: Change the current working directory (maybe won't do)
    TODO: exit: Exit the terminal
    DONE: export: Export a variable to the environment
    TODO: history: Show the history of commands
    TODO: logout: Log out of the current session
    TODO: printf: Print formatted output to the terminal
    DONE: pwd: Print the current working directory
    TODO: where: Print the location of all matching commands
    TODO: which: Print the path of the command

    idk if you would consider these builtins but they're special commands
    !! - Runs last command
    !* - Runs previous command except its first word
    !*:p - Displays what !* substitutes
    !x - Runs recent command in the bash history that begins with x
    !x:p - Displays the x command and adds it as the recent command in history
    !$ - Same as OPTION+., brings forth last argument of the previous command
    !^ - Substitutes first argument of last command in the current command
    !$:p - Displays the word that !$ substitutes
    ^123^abc - Replaces 123 with abc
    !n:m - Repeats argument within a range (i.e, m 2-3)
    !fi - Repeats latest command in history that begins with fi
    !n - Run nth command from the bash history (by index)
    !n:p - Prints the command !n executes
    !n:$ - Repeat arguments from the last command (i.e, from argument n to $)
     */
    builtins: { [name: string]: (args: string[], terminal: Terminal) => number } = {
        cd,
        history,
        pwd,
        passthrough,
        "export": custom_export,
        unset
    };

    constructor() {
        this.input_buffer = new Buffer();
        this.output_line_buffer = new Buffer();

        // Start intervals
        this.start_blinking();
        this.start_typing_timeout();
        this.start_render_buffer_listener();
        this.start_focus_listener();
        this.start_keydown_listener();
        this.start_keyup_listener();
        this.create_keyboard_shortcuts();

        focus();

    }

    // Intervals
    start_blinking() {
        setInterval(() => {
            let cursor = document.getElementById("cursor");
            if (cursor === null) return;
            if (this.typing)
                cursor!.classList.add("active");
            else
                cursor!.classList.toggle("active");
        }, 500);
    }

    start_typing_timeout() {
        setInterval(() => {
            // As long as the user is not typing, remove one millisecond from the timeout
            // Once the timeout hits 0, the user is no longer typing, and we can start the cursor blinking
            // Aka, if the user stops typing for 75ms, the cursor will begin to blink
            if (this.keydown_timeout > 0) {
                this.keydown_timeout -= 1;
            } else {
                this.typing = false;
            }
        }, 1);
    }

    start_render_buffer_listener() {
        OUTPUT_BUFFER.onChange((_old_value, _new_value) => {
            // TODO: Maybe implement some buffering so that the terminal doesn't update every time we make a change
            // This would probably speed up the app as we don't have to re-render the entire terminal every time we make a change
            // Whenever the output buffer changes, we need to update the output frame
            this.render_output_buffer();
        });

        this.output_line_buffer.onChange((_old_value, _new_value) => {
            this.render_output_buffer();
        });
    }

    start_focus_listener() {
        window.addEventListener("blur", () => {
            // Clear the pressed modifiers (they get stuck if a user is holding a modifier key and changes tab/tabs out of the window)
            // This is because the keyup event doesn't fire when the user tabs out of the window
            this.pressed_buttons = {};
        });

    }

    start_keyup_listener() {
        // Set up a listener for keyup events, so we can release modifier keys
        document.body.addEventListener("keyup", (e) => {
            if (["Control", "Shift", "Alt", "Super", "OS", "Meta"].includes(e.key)) {
                this.pressed_buttons[e.key] = false;
            }

            if (e.key === this.waiting_for_release)
                this.waiting_for_release = undefined;
        });
    }

    start_keydown_listener() {
        document.body.addEventListener("keydown", async (e) => {
            this.keydown_timeout = 75;
            this.typing = true;

            if (!this.pass_through_enabled) e.preventDefault();
            // Handle some special keys
            switch (e.key) {
                case "Backspace":
                    this.handle_backspace_key();
                    break;

                case "Delete":
                    this.handle_delete_key();
                    break;

                case "Enter":
                    await this.handle_enter_key();
                    break;

                case "Tab":
                    this.handle_tab_key();
                    break;

                case "ArrowUp":
                case "ArrowDown":
                case "ArrowLeft":
                case "ArrowRight":
                    this.handle_arrow_key(e.key);
                    break;

                default:
                    this.handle_other_key(e.key);
                    break;
            }
        });
    }

    async handle_command_input(input: string) {
        // Lets do some pre-processing to the input
        // TODO: Here we would replace environment variables
        let home_dir = computer.get_env("HOME");
        if (!home_dir) {
            let user = computer.get_current_user().get_username();
            console.info(`HOME environment variable not set, defaulting to /home/${user}`);
            home_dir = `/home/${user}`;
        }
        input = input.replaceAll("~", home_dir);

        const command = input.split(" ")[0];
        const args = input.split(" ").slice(1);

        // Print a newline before running the command
        print();

        resetFormattingCounter();
        // Check if we're running a builtin command
        if (this.builtins[command] !== undefined) {
            // Terminal builtins do return a status code
            // we're just not doing anything with it atm
            this.builtins[command](args, this);
        } else {
            const status_code = await computer.run_command(command, args);

            debug(`Command status code: ${status_code}`);
        }


        // At the end, the last thing we want to do is reprint the prompt and reset the input buffer
        // We're also going to do what zsh does and print a newline if one wasn't already there (with the little %)
        // Check if the last thing in the output buffer is a newline
        // This is kinda hacky, but I can't think of a better solution
        // Running clear makes the terminal print the '%' and insert a newline
        if (OUTPUT_BUFFER.last() !== "<br />" && command != "clear") {
            // Black text, white background, character '%' and then reset
            print("\\e[47m\\e[0;30m%\\e[0m\\e[0m");
        }

        while (FORMATTING_COUNTER > 0) {
            OUTPUT_BUFFER.push("</span>");
            decrementFormattingCounter();
        }

    }

    // Button handler functions
    handle_backspace_key() {
        let popped_value = this.input_buffer.pop();
        if (popped_value) {
            this.output_line_buffer.pop();
        }
        // Reset our history position
        if (this.input_buffer.length()) this.input_index = -1;
        this.position_cursor()
    }

    handle_delete_key() {
        console.warn("Delete key not implemented");
    }

    async handle_enter_key() {
        if (this.input_buffer.length() > 0) {
            const joined = this.input_buffer.join("");

            // Save our current input to the history
            computer.add_shell_history_record(joined);

            // Clear the input buffer and line buffer and move it to the main output buffer
            this.input_buffer.clear();
            OUTPUT_BUFFER.appendToElement(this.output_line_buffer.join(""), -1);
            this.output_line_buffer.clear();

            // Handle the command
            await this.handle_command_input(joined);
        } else {
            // If we have no input, just go down a line and reprint the prompt
            print();
        }

        this.print_prompt();
    }

    handle_tab_key() {
        // List all files in the current directory and find the longest common prefix
        let files = computer.current_session().get_current_dir().get_children();

        // If we have no files, we can't do anything
        if (files.length === 0) return;


        // Match the beginning of the input buffer to the beginning of the file names
        let matches = files.filter((file) => file.get_name().startsWith(this.input_buffer.join("")));

        // If we have no matches, we can't do anything
        if (matches.length === 0) return;

        // If we have only one match, we can just print it
        if (matches.length === 1) {
            let match = matches[0].get_name();
            // If the match is a directory, add a slash
            if (matches[0].is_directory()) match += "/";
            // Write the rest of the match to the output buffer (the rest that we haven't already written)
            // Figure out how many characters the user already typed
            let user_typed = this.input_buffer.join("").length;
            // Slice the match from the user_typed index to the end
            let match_slice = match.slice(user_typed);
            // Write the match slice to the output buffer
            for (let char of match_slice) OUTPUT_BUFFER.push(char);


            this.input_buffer.clear();
            // Push each character of the match to the input buffer
            for (let char of match) this.input_buffer.push(char);


            return;
        }


    }

    handle_arrow_key(arrow: string) {
        console.warn(`Arrow key not implemented: ${arrow}`);
    }

    handle_other_key(key: string) {
        // We can't do anything while we're waiting for a key to be released
        if (!this.waiting_for_release) {
            // Super, OS, and Meta are all the same key, but they have different names depending on the OS/browser
            if (NON_PRINTABLES.includes(key)) {
                this.pressed_buttons[key] = true;
            } else {
                // If we have no modifier keys, don't bother checking
                // because the computation is expensive
                let has_modifier = false;
                for (let mod in this.pressed_buttons) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (this.pressed_buttons.hasOwnProperty(mod)) {
                        // If we have even just one modifier, we can try to run keyboard shortcuts
                        if (this.pressed_buttons[mod]) {
                            has_modifier = true;
                            break;
                        }
                    }
                }

                let handled = false;
                // Find a better way to do this, but basically we can try to run keyboard shortcuts if we have a modifier
                // and if pass-through mode is enabled, the only shortcut we'll respond to is Control + Shift + Escape
                if (has_modifier && (!this.pass_through_enabled || (this.pressed_buttons["Control"] && this.pressed_buttons["Shift"] && key === "Escape"))) {
                    // Try to run keyboard shortcuts
                    handled = this.handle_keyboard_shortcut(key);
                }

                if (handled) {
                    this.waiting_for_release = key;
                }

                // If we haven't already handled a shortcut and we either don't have pass-through enabled
                // or we're not trying to enter a shortcut (normal typing), we can allow characters to be entered
                if (!handled && (!this.pass_through_enabled || !has_modifier)) {
                    this.input_buffer.push(key);
                    this.output_line_buffer.push(escape_html(key));
                    this.position_cursor();
                }
            }
        }
    }

    /* Shortcuts to implement:
        * Ctrl + L: Clear the screen (DONE)
        * Ctrl + U: Clear the input buffer (DONE)
        * Ctrl + A: Move the cursor to the start of the input buffer
        * Ctrl + E: Move the cursor to the end of the input buffer
        * Ctrl + W: Delete the word before the cursor
        * Ctrl + P: Same thing as the up arrow key
        * Ctrl + R: Search for the last command that starts with the input buffer
        * Ctrl + Shift + C: Copy the input buffer to the clipboard
        * Ctrl + Shift + V: Paste the clipboard into the input buffer
        * Alt + F: Move the cursor to the beginning of the next word
        * Alt + B: Move the cursor to the beginning of the previous word
        * Ctrl + J: Same as the enter key
        * Ctrl + G: Exit the search mode and revert the buffer to its initial state (before search)
        * Home: Move the cursor to the beginning of the input buffer
        * End: Move the cursor to the end of the input buffer
     */

    // TODO: Maybe separate these callback functions into a separate file?
    create_keyboard_shortcuts() {
        // Control + L - Clear the screen
        this.keyboard_shortcuts.push(new KeyboardShortcut("Control + L", (term) => {
            OUTPUT_BUFFER.clear();
            term.input_buffer.clear();
            term.print_prompt();
        }, this));

        // Control + U - Clear the current input line
        this.keyboard_shortcuts.push(new KeyboardShortcut("Control + U", (term) => {
            // Count the characters in the input buffer and remove that many from the output buffer
            let count = term.input_buffer.length();
            term.input_buffer.clear();

            for (let i = 0; i < count; i++) {
                OUTPUT_BUFFER.pop();
            }
        }, this));

        this.keyboard_shortcuts.push(new KeyboardShortcut("Control + Shift + Escape", (term) => {
            term.pass_through_enabled = !term.pass_through_enabled;
            PASS_THROUGH_INDICATOR!.style.display = term.pass_through_enabled ? "block" : "none";
        }, this));
    }

    handle_keyboard_shortcut(key: string): boolean {
        // TODO: Prevent shortcuts from being held down and triggering multiple times
        // Possible solution: When a shortcut is handled, set the value of each pressed button to false
        // This will prevent the shortcut from being handled again until all buttons are released
        find: {
            for (let shortcut of this.keyboard_shortcuts) {
                if (shortcut.isPressed(this.pressed_buttons, key)) break find;
            }

            // Else our for loop (like python)
            return false;
        }

        // If we successfully make it out of the "find" label, our shortcut was handled
        return true;
    }

    print_prompt() {
        print(this.generate_prompt(), {sanitize: false, newline: false});
    }

    clear() {
        OUTPUT_BUFFER.clear();
        this.print_prompt();
    }

    position_cursor() {
        console.warn("Not implemented yet");
    }

    render_output_buffer() {
        OUTPUT_FRAME!.innerHTML = OUTPUT_BUFFER.join("") + this.output_line_buffer.join("");
    }

    generate_prompt() {
        // TODO: Support $PS1 environment variable
        const prompt_format = "\\e[0;31m\\u\\e[0m@\\e[0;32m\\h\\e[0m:\\e[0;34m\\w\\\\e[0m\\$ ";

        // Default shell prompt is <USERNAME>@<HOSTNAME>:<WORKING DIR><$/#>

        // \d   The date, in "Weekday Month Date" format (e.g., "Tue May 26").
        // \h   The hostname (we don't care about dots here)
        // \t   The time, in 24-hour HH:MM:SS format.
        // \T   The time, in 12-hour HH:MM:SS format.
        // \@   The time, in 12-hour am/pm format.
        // \u   The username of the current user.
        // \w   The current working directory.
        // \W   The basename of $PWD.
        // \$   If you are not root, inserts a "$"; if you are root, you get a "#"  (root uid = 0)
        // \\   A backslash.

        // Note: If we're using \W and our current working directory
        // is our home directory, we'll just show ~


        // I'll worry about color checking correctness later
        // At this point, if someone breaks this, it's their own fault

        let prompt = prompt_format;
        prompt = prompt.replaceAll("\\d", make_backslash_d());
        prompt = prompt.replaceAll("\\h", computer.get_hostname());
        prompt = prompt.replaceAll("\\t", make_backslash_t());
        prompt = prompt.replaceAll("\\T", make_backslash_capital_t());
        prompt = prompt.replaceAll("\\@", make_backslash_at());
        prompt = prompt.replaceAll("\\u", computer.get_current_user().get_username());
        prompt = prompt.replaceAll("\\w", computer.current_session().get_current_dir().pwd());
        // TODO: Replace home directory with ~
        prompt = prompt.replaceAll("\\W", computer.current_session().get_current_dir().get_name());
        prompt = prompt.replaceAll("\\$", geteuid() === 0 ? "#" : "$");
        prompt = prompt.replaceAll("\\\\", "\\");

        // TODO: Support ANSI escape color codes

        // Regular colors
        prompt = prompt.replaceAll("\\e[0;30m", "<span style='color: var(--term-black)'>");
        prompt = prompt.replaceAll("\\e[0;31m", "<span style='color: var(--term-red)'>");
        prompt = prompt.replaceAll("\\e[0;32m", "<span style='color: var(--term-green)'>");
        prompt = prompt.replaceAll("\\e[0;33m", "<span style='color: var(--term-yellow)'>");
        prompt = prompt.replaceAll("\\e[0;34m", "<span style='color: var(--term-blue)'>");
        prompt = prompt.replaceAll("\\e[0;35m", "<span style='color: var(--term-purple)'>");
        prompt = prompt.replaceAll("\\e[0;36m", "<span style='color: var(--term-cyan)'>");
        prompt = prompt.replaceAll("\\e[0;37m", "<span style='color: var(--term-white)'>");

        // Bold colors
        prompt = prompt.replaceAll("\\e[1;30m", "<span style='font-weight: bold; color: var(--term-black)'>");
        prompt = prompt.replaceAll("\\e[1;31m", "<span style='font-weight: bold; color: var(--term-red)'>");
        prompt = prompt.replaceAll("\\e[1;32m", "<span style='font-weight: bold; color: var(--term-green)'>");
        prompt = prompt.replaceAll("\\e[1;33m", "<span style='font-weight: bold; color: var(--term-yellow)'>");
        prompt = prompt.replaceAll("\\e[1;34m", "<span style='font-weight: bold; color: var(--term-blue)'>");
        prompt = prompt.replaceAll("\\e[1;35m", "<span style='font-weight: bold; color: var(--term-purple)'>");
        prompt = prompt.replaceAll("\\e[1;36m", "<span style='font-weight: bold; color: var(--term-cyan)'>");
        prompt = prompt.replaceAll("\\e[1;37m", "<span style='font-weight: bold; color: var(--term-white)'>");

        // Underline colors
        prompt = prompt.replaceAll("\\e[4;30m", "<span style='text-decoration: underline; color: var(--term-black)'>");
        prompt = prompt.replaceAll("\\e[4;31m", "<span style='text-decoration: underline; color: var(--term-red)'>");
        prompt = prompt.replaceAll("\\e[4;32m", "<span style='text-decoration: underline; color: var(--term-green)'>");
        prompt = prompt.replaceAll("\\e[4;33m", "<span style='text-decoration: underline; color: var(--term-yellow)'>");
        prompt = prompt.replaceAll("\\e[4;34m", "<span style='text-decoration: underline; color: var(--term-blue)'>");
        prompt = prompt.replaceAll("\\e[4;35m", "<span style='text-decoration: underline; color: var(--term-purple)'>");
        prompt = prompt.replaceAll("\\e[4;36m", "<span style='text-decoration: underline; color: var(--term-cyan)'>");
        prompt = prompt.replaceAll("\\e[4;37m", "<span style='text-decoration: underline; color: var(--term-white)'>");

        // Background colors
        prompt = prompt.replaceAll("\\e[40m", "<span style='background-color: var(--term-black)'>");
        prompt = prompt.replaceAll("\\e[41m", "<span style='background-color: var(--term-red)'>");
        prompt = prompt.replaceAll("\\e[42m", "<span style='background-color: var(--term-green)'>");
        prompt = prompt.replaceAll("\\e[43m", "<span style='background-color: var(--term-yellow)'>");
        prompt = prompt.replaceAll("\\e[44m", "<span style='background-color: var(--term-blue)'>");
        prompt = prompt.replaceAll("\\e[45m", "<span style='background-color: var(--term-purple)'>");
        prompt = prompt.replaceAll("\\e[46m", "<span style='background-color: var(--term-cyan)'>");
        prompt = prompt.replaceAll("\\e[47m", "<span style='background-color: var(--term-white)'>");

        // Light/high intensity colors
        prompt = prompt.replaceAll("\\e[0;90m", "<span style='color: var(--term-light-black)'>");
        prompt = prompt.replaceAll("\\e[0;91m", "<span style='color: var(--term-light-red)'>");
        prompt = prompt.replaceAll("\\e[0;92m", "<span style='color: var(--term-light-green)'>");
        prompt = prompt.replaceAll("\\e[0;93m", "<span style='color: var(--term-light-yellow)'>");
        prompt = prompt.replaceAll("\\e[0;94m", "<span style='color: var(--term-light-blue)'>");
        prompt = prompt.replaceAll("\\e[0;95m", "<span style='color: var(--term-light-purple)'>");
        prompt = prompt.replaceAll("\\e[0;96m", "<span style='color: var(--term-light-cyan)'>");
        prompt = prompt.replaceAll("\\e[0;97m", "<span style='color: var(--term-light-white)'>");

        // Light/high intensity bold colors
        prompt = prompt.replaceAll("\\e[1;90m", "<span style='font-weight: bold; color: var(--term-light-black)'>");
        prompt = prompt.replaceAll("\\e[1;91m", "<span style='font-weight: bold; color: var(--term-light-red)'>");
        prompt = prompt.replaceAll("\\e[1;92m", "<span style='font-weight: bold; color: var(--term-light-green)'>");
        prompt = prompt.replaceAll("\\e[1;93m", "<span style='font-weight: bold; color: var(--term-light-yellow)'>");
        prompt = prompt.replaceAll("\\e[1;94m", "<span style='font-weight: bold; color: var(--term-light-blue)'>");
        prompt = prompt.replaceAll("\\e[1;95m", "<span style='font-weight: bold; color: var(--term-light-purple)'>");
        prompt = prompt.replaceAll("\\e[1;96m", "<span style='font-weight: bold; color: var(--term-light-cyan)'>");
        prompt = prompt.replaceAll("\\e[1;97m", "<span style='font-weight: bold; color: var(--term-light-white)'>");

        // TODO: "dim colors"
        // TODO: blinking

        // Remove color: \e[0m
        prompt = prompt.replaceAll("\\e[0m", "</span>");
        return prompt;
    }

    async main() {
        const result = await computer.add_user("user", "password", {home_dir: "/home/user"});
        if (result.ok()) {
            const res = computer.new_session(result.get_data()!.get_uid());
            if (!res) {
                print("[<span style='color: red; font-weight: bold;'>FAIL</span>]: Failed to create new session. Check console for details.", {escape_html: false});
                return;
            }
        } else {
            console.error(`Failed to create new user: ${result.get_message()}`);
            print("[<span style='color: red; font-weight: bold;'>FAIL</span>]: Failed to create new user. Check console for details.", {escape_html: false});
            return;
        }

        await computer.post_session_init();

        print("./steve.sh [Version 0.0.0]");
        print("(c) Steve Tautonico. All rights reserved.");
        print("type 'help' for a list of commands.");
        print(); // Newline

        this.print_prompt();
    }

}

const terminal = new Terminal();
// @ts-ignore: Top level await is supported in ES2015(?)
await terminal.main();
