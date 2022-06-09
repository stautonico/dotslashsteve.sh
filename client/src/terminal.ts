import {OUTPUT_FRAME, CURSOR, output_buffer, computer} from "./helpers/globals.js";
import {make_backslash_d, make_backslash_t, make_backslash_T, make_backslash_at} from "./helpers/date.js";

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
    }
    ps1 = generate_prompt();
    // We make a new prompt regardless of the existence of input or not
    // This is so we can update the time and date if we enter anything
}

function generate_prompt() {
    // TODO: Support $PS1 environment variable
    let prompt_format = "\\e[0;31m\\u\\e[0m@\\e[0;32m\\h\\e[0m:\\e[0;34m\\w\\\\e[0m\\$ ";

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
    prompt = prompt.replaceAll("\\d",  make_backslash_d());
    prompt = prompt.replaceAll("\\h", computer.get_hostname())
    prompt = prompt.replaceAll("\\t", make_backslash_t());
    prompt = prompt.replaceAll("\\T", make_backslash_T());
    prompt = prompt.replaceAll("\\@", make_backslash_at());
    prompt = prompt.replaceAll("\\u",computer.get_current_user().get_username());
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


async function main() {
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

    ps1=generate_prompt();
    output_buffer.push([ps1]);

    render_buffer();

    start_intervals();
}

// @ts-ignore
await main();