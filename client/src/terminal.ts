import {OUTPUT_FRAME, CURSOR, output_buffer, computer} from "./helpers/globals.js";
let input_buffer: string[] = [];
let typing = false;
let keydown_timeout = 0;
let ps1 = "prompt";

function start_scroll() {
    setInterval(() => {
        // Problem: You can't manually scroll
        CURSOR!.scrollIntoView();
    }, 100);
}

function start_blinking() {
    setInterval(() => {
        if (typing) {
            CURSOR!.classList.add("active");
        } else {
            CURSOR!.classList.toggle("active");
        }
    }, 500);
}

function start_typing_timeout() {
    setInterval(() => {
        // As long as the user is not typing, remove one millisecond from the timeout
        // Once the timeout hits 0, the user is no longer typing, and we can start the cursor blinking
        if (keydown_timeout > 0) {
            keydown_timeout -= 1;
        } else {
            typing = false;
        }
    }, 1);
}

function start_keydown_listener() {
// We're going use our buffer to handle key input
    document.body.addEventListener("keydown", async (e) => {
        keydown_timeout = 75;
        typing = true;
        if (e.key === "Backspace") {
            if (input_buffer.length > 0) {
                output_buffer[output_buffer.length - 1].pop();
                input_buffer.pop();
            }
        } else if (e.key === "Enter") {
            // Process input
            await handle_input();

            output_buffer.push([ps1]);
            // Clear the input buffer
            input_buffer = [];
        } else if (e.key === "Tab") {
            // TODO: Handle tab completion
            alert("Tab completion not implemented yet.");
        } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            // TODO: Handle arrow keys
            alert("Arrow keys not implemented yet.");
        } else if (!(["Shift", "Control", "Alt", "OS", "Meta", "Escape"].includes(e.key))) {
            output_buffer[output_buffer.length - 1].push(e.key);
            input_buffer.push(e.key);
        }

        render_buffer();
    });
}

function start_intervals() {
    start_scroll();
    start_blinking();
    start_typing_timeout();
    start_keydown_listener();
}

function render_buffer() {
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

async function handle_input() {
    if (input_buffer.length > 0) {
        const joined = input_buffer.join("");

        const command = joined.split(" ")[0];
        const args = joined.split(" ").slice(1);

        try {
            const module = await import(`./bin/${command}.js`);
            module.main(args);
        } catch (e) {
            // @ts-ignore
            if (e.name === "TypeError") {
                output_buffer.push([`shell: command not found: ${command}`]);
                console.error(e);
            } else {
                output_buffer.push([`Something went wrong, check the console for more details.`]);
                console.error(e);
            }
        }
        ps1 = generate_prompt();
    }
}

function generate_prompt() {
    // TODO: Support $PS1 environment variable
    // let prompt_format = "\\e[0;31m\\u\\e[0m@\\e[0;32m\\h\\e[0m:\\e[0;34m\\w\\\\e[0m\\$ ";
    let prompt_format = "\\u@\\h \\W \\$ ";
    // Default shell prompt is <USERNAME>@<HOSTNAME>:<WORKING DIR><$/#>

    // \d   The date, in "Weekday Month Date" format (e.g., "Tue May 26").
    // \h   The hostname, up to the first .
    // \t   The time, in 24-hour HH:MM:SS format.
    // \T   The time, in 12-hour HH:MM:SS format.
    // \@   The time, in 12-hour am/pm format.
    // \u   The username of the current user.
    // \w   The current working directory.
    // \W   The basename of $PWD.
    // \$   If you are not root, inserts a "$"; if you are root, you get a "#"  (root uid = 0)
    // \e   An escape character (typically a color code).
    // \\   A backslash.

    let prompt = prompt_format;
    // prompt = prompt.replace("\\d", datetime.now().strftime("%a %B %d"))
    prompt = prompt.replace("\\h", computer.get_hostname())
    // prompt = prompt.replace("\\t", datetime.now().strftime("%H:%M:%S"))
    // prompt = prompt.replace("\\T", datetime.now().strftime("%I:%M:%S"))
    // prompt = prompt.replace("\\@", datetime.now().strftime("%I:%M:%S %p"))
    prompt = prompt.replace("\\u",computer.get_current_user().get_username())
    // prompt = prompt.replace("\\w", self.computers[-1].sessions[-1].current_dir.pwd())
    // TODO: Current working directory
    prompt = prompt.replace("\\W", "/");
    prompt = prompt.replace("\\$", computer.geteuid() === 0 ? "#" : "$");
    prompt = prompt.replace("\\\\", "\\")

    // TODO: Support ANSI escape color codes
    // prompt = prompt.replace("\\e[0;31m", Fore.RED)
    // prompt = prompt.replace("\\e[1;31m", Fore.LIGHTRED_EX)
    // prompt = prompt.replace("\\e[0;32m", Fore.GREEN)
    // prompt = prompt.replace("\\e[1;32m", Fore.LIGHTGREEN_EX)
    // prompt = prompt.replace("\\e[0;33m", Fore.YELLOW)
    // prompt = prompt.replace("\\e[1;33m", Fore.LIGHTYELLOW_EX)
    // prompt = prompt.replace("\\e[0;34m", Fore.BLUE)
    // prompt = prompt.replace("\\e[1;34m", Fore.LIGHTBLUE_EX)
    // prompt = prompt.replace("\\e[0;35m", Fore.MAGENTA)
    // prompt = prompt.replace("\\e[1;35m", Fore.LIGHTMAGENTA_EX)
    //
    // prompt = prompt.replace("\\e[41m", Back.RED)
    // prompt = prompt.replace("\\e[42m", Back.GREEN)
    // prompt = prompt.replace("\\e[43m", Back.YELLOW)
    // prompt = prompt.replace("\\e[44m", Back.BLUE)
    // prompt = prompt.replace("\\e[45m", Back.MAGENTA)
    // prompt = prompt.replace("\\e[46m", Back.LIGHTBLUE_EX)

    // Remove color: \e[0m
    // prompt = prompt.replace("\\e[0m", Style.RESET_ALL)
    return prompt;
}

async function main() {
    output_buffer.push(["./steve.sh [Version 0.0.0]"]);
    output_buffer.push(["(c) Steve Tautonico. All rights reserved."]);
    output_buffer.push(["type 'help' for a list of commands."]);
    output_buffer.push([]);
    const result = await computer.add_user("user", "password");
    if (result.ok()) {
        const res = computer.new_session(result.get_data()!.get_uid());
        if (!res) {
            alert("Failed to create new session, terminating.");
            return;
        }
    }

    ps1=generate_prompt();
    output_buffer.push([ps1]);

    render_buffer();

    start_intervals();
}

// @ts-ignore
await main();