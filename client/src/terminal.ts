import {OUTPUT_FRAME, CURSOR, output_buffer} from "./helpers/globals.js";
let input_buffer: string[] = [];
let typing = false;
let keydown_timeout = 0;
let ps1 = "steve@localhost:~$ ";

setInterval(() => {
    // Problem: You can't manually scroll
   CURSOR!.scrollIntoView();
}, 100);

setInterval(() => {
    if (typing) {
        CURSOR!.classList.add("active");
    } else {
        CURSOR!.classList.toggle("active");
    }
}, 500);

setInterval(() => {
    // As long as the user is not typing, remove one millisecond from the timeout
    // Once the timeout hits 0, the user is no longer typing, and we can start the cursor blinking
    if (keydown_timeout > 0) {
        keydown_timeout -= 1;
    } else {
        typing = false;
    }
}, 1);

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
    }else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        // TODO: Handle arrow keys
        alert("Arrow keys not implemented yet.");
    } else if (!(["Shift", "Control", "Alt", "OS", "Meta", "Escape"].includes(e.key))) {
        output_buffer[output_buffer.length - 1].push(e.key);
        input_buffer.push(e.key);
    }

    render_buffer();
});

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
    const joined = input_buffer.join("");

    const command = joined.split(" ")[0];
    const args = joined.split(" ").slice(1);

    try {
        const module = await import(`./bin/${command}.js`);
        module.main(args);
    } catch (e) {
        output_buffer.push([`shell: command not found: ${command}`]);
    }
}

function main() {
    output_buffer.push(["./steve.sh terminal"]);
    output_buffer.push(["Type 'help' for a list of commands."]);
    output_buffer.push([]);
    output_buffer.push([ps1]);
    render_buffer();
}

main();