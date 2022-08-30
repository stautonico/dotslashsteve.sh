import {OUTPUT_FRAME, CURSOR, output_buffer, computer} from "./helpers/globals";
import {make_backslash_d, make_backslash_t, make_backslash_T, make_backslash_at} from "./helpers/date";
import {escape_html} from "./helpers/html";
import {cd, clear, history, pwd} from "./terminal_builtins";

import {Buffer} from "./helpers/io";

export class Terminal {
    input_buffer: Buffer;
    typing = false;
    keydown_timeout = 0;
    ps1 = "prompt";
    input_index = -1;
    // A temporary buffer to hold our current line's input so we can go back to it if we press down arrow on the last history item
    current_line_input_buffer: Buffer;

    // List of builtins to implement
    // TODO: alias: Create an alias for a command
    // DONE: cd: Change the current working directory
    // TODO: chdir: Change the current working directory (maybe won't do)
    // DONE: clear: Clear the terminal screen
    // TODO: exit: Exit the terminal
    // TODO: export: Export a variable to the environment
    // TODO: history: Show the history of commands
    // TODO: logout: Log out of the current session
    // TODO: printf: Print formatted output to the terminal
    // DONE: pwd: Print the current working directory
    // TODO: where: Print the location of all matching commands
    // TODO: which: Print the path of the command
    builtins: { [name: string]: (args: string[], terminal: Terminal) => number } = {
        cd,
        clear,
        history,
        pwd
    }

    constructor() {
        this.input_buffer = new Buffer();
        this.current_line_input_buffer = new Buffer();
        this.start_scroll();
        this.start_blinking();
        this.start_typing_timeout();
        this.start_keydown_listener();
    }

    start_scroll() {
        setInterval(() => {
            // Problem: You can't manually scroll
            CURSOR!.scrollIntoView();
        }, 100);
    }

    start_blinking() {
        setInterval(() => {
            if (this.typing) {
                CURSOR!.classList.add("active");
            } else {
                CURSOR!.classList.toggle("active");
            }
        }, 500);
    }

    start_typing_timeout() {
        setInterval(() => {
            // As long as the user is not typing, remove one millisecond from the timeout
            // Once the timeout hits 0, the user is no longer typing, and we can start the cursor blinking
            if (this.keydown_timeout > 0) {
                this.keydown_timeout -= 1;
            } else {
                this.typing = false;
            }
        }, 1);
    }

    start_keydown_listener() {
        // We're going use our buffer to handle key input
        document.body.addEventListener("keydown", async (e) => {
            this.keydown_timeout = 75;
            this.typing = true;
            if (e.key === "Backspace") {
                if (this.input_buffer.length() > 0) {
                    output_buffer[output_buffer.length - 1].pop();
                    this.input_buffer.pop();
                    // Also reset our history position
                    this.input_index = -1;
                }
            } else if (e.key === "Enter") {
                // Process input
                await this.handle_input();

                // Reset the input history index
                this.input_index = -1;
                output_buffer.push([this.ps1]);
                // Clear the input buffer
                this.input_buffer.empty();
            } else if (e.key === "Tab") {
                // TODO: Handle tab completion
                alert("Tab completion not implemented yet.");
            } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                // TODO: Handle left and right arrow keys
                if (e.key === "ArrowUp") {
                    this.input_index += 1;
                    // If we have a history item, clear the input buffer and add the history item
                    const history_item = computer.get_input_history(this.input_index);
                    if (history_item !== undefined) {
                        // @ts-ignore: This will always have split as we provided an index
                        this.input_buffer = history_item.split("");
                        // Remove everything except the first element (the prompt) from the last output buffer line
                        output_buffer.push([this.ps1, ...this.input_buffer.all()]);
                    } else {
                        // We've gone past the end of the history, so go make sure the counter doesn't go out of bounds
                        this.input_index -= 1;
                    }
                } else if (e.key === "ArrowDown") {
                    if (this.input_index > 0) {
                        this.input_index -= 1;
                    }
                    const history_item = computer.get_input_history(this.input_index);
                    if (history_item !== undefined) {
                        // @ts-ignore: This will always have split as we provided an index
                        this.input_buffer = history_item.split("");
                        output_buffer.push([this.ps1, ...this.input_buffer.all()])
                    } else {
                        // We're at the last item, revert to the current line's input
                        this.input_buffer = this.current_line_input_buffer;
                        output_buffer.push([this.ps1, ...this.input_buffer.all()])
                    }

                } else {
                    alert("Left and right arrow keys not implemented yet.");
                }
            } else if (!(["Shift", "Control", "Alt", "OS", "Meta", "Escape"].includes(e.key))) {
                // We're entering a standard key, but we need to escape it first (so the user can't enter HTML and break
                // the terminal)
                output_buffer[output_buffer.length - 1].push(escape_html(e.key));
                this.input_buffer.push(escape_html(e.key));
                this.current_line_input_buffer = this.input_buffer;
            }


            this.render_buffer();
        });
    }

    render_buffer() {
        let output = "";

        for (const line of output_buffer)
            output += line.map((c) => {
                if (c === " ") {
                    return "&nbsp;";
                } else {
                    return c;
                }
            }).join("") + "<br />";

        // Remove the last line break
        output = output.slice(0, -6); // 6 = length of "<br />"

        OUTPUT_FRAME!.innerHTML = output;
    }

    async handle_input() {
        if (this.input_buffer.length() > 0) {
            const joined = this.input_buffer.join("");

            // Save our current input to the history
            computer.add_input_record(joined);

            const command = joined.split(" ")[0];
            const args = joined.split(" ").slice(1);

            // Check if we're running a builtin command
            if (this.builtins[command] !== undefined) {
                this.builtins[command](args, this);
            } else {
                try {
                    const module = await import(`./bin/${command}.js`);
                    module.main(args);
                } catch (e) {
                    // @ts-ignore
                    if (e.name === "TypeError") {
                        output_buffer.push([`shell: command not found: ${command}`]);
                        console.error(e);
                    } else {
                        output_buffer.push(["Something went wrong, check the console for more details."]);
                        console.error(e);
                    }
                }
            }
        }
        this.ps1 = this.generate_prompt();
        // We make a new prompt regardless of the existence of input or not
        // This is so we can update the time and date if we enter anything
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
        prompt = prompt.replaceAll("\\h", computer.get_hostname())
        prompt = prompt.replaceAll("\\t", make_backslash_t());
        prompt = prompt.replaceAll("\\T", make_backslash_T());
        prompt = prompt.replaceAll("\\@", make_backslash_at());
        prompt = prompt.replaceAll("\\u", computer.get_current_user().get_username());
        prompt = prompt.replaceAll("\\w", computer.current_session().get_current_dir().pwd());
        // TODO: Replace home directory with ~
        prompt = prompt.replaceAll("\\W", computer.current_session().get_current_dir().get_name());
        prompt = prompt.replaceAll("\\$", computer.sys$geteuid() === 0 ? "#" : "$");
        prompt = prompt.replaceAll("\\\\", "\\")

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
        output_buffer.push(["./steve.sh [Version 0.0.0]"]);
        output_buffer.push(["(c) Steve Tautonico. All rights reserved."]);
        output_buffer.push(["type 'help' for a list of commands."]);
        output_buffer.push([]);
        const result = await computer.add_user("user", "password", {home_dir: "/home/user"});
        if (result.ok()) {
            const res = computer.new_session(result.get_data()!.get_uid());
            if (!res) {
                alert("Failed to create new session, terminating.");
                return;
            }
        }

        this.ps1 = this.generate_prompt();
        output_buffer.push([this.ps1]);

        this.render_buffer();
    }

}

const terminal = new Terminal();
// @ts-ignore: Top level await is supported in ES2015(?)
await terminal.main();