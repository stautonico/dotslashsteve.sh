import {print} from "../helpers/io";
import {ArgParser} from "../helpers/argparser";
import {computer} from "../helpers/globals";
import {arch} from "../helpers/arch";

// TODO: Make these not change every time it's run
const SHELLS = ["Trout", "Bish"];
const TERMINALS = ["Puppy"];

function get_username() {
    const current_session = computer.current_session()
    const uid = current_session.get_effective_uid();
    const user = computer.get_user_by_uid(uid);
    return user ? user.get_username() : "?";
}


function get_gpu() {
    let canvas = document.createElement("canvas");
    let gl = canvas.getContext("experimental-webgl");
    if (gl) {
        // @ts-ignore
        // TODO: Maybe remove, firefox says this is "deprecated and will be removed. Please use RENDERER."
        let dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
        // @ts-ignore
        let renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        // Add some exceptions for some cards
        if (renderer.indexOf("(R)") !== -1) // Intel integrated
            return renderer;

        // If we have parentheses, extract the contents
        if (renderer.indexOf("(") !== -1)
            renderer = renderer.substring(renderer.indexOf("(") + 1, renderer.indexOf(")"));

        // If we have a comma, split and take the second part
        if (renderer.indexOf(",") !== -1)
            renderer = renderer.split(",")[1];

        // If we have slashes, split and take the first part
        if (renderer.indexOf("/") !== -1)
            renderer = renderer.split("/")[0];

        return renderer;
    }
    return "?";
}

function get_memory() {
    let used, max;
    try {
        // @ts-ignore: Try will catch if the browser doesn't support this
        used = window.performance.memory.usedJSHeapSize / 1024 / 1024;
        // @ts-ignore: Try will catch if the browser doesn't support this
        max = window.performance.memory.jsHeapSizeLimit / 1024 / 1024;
    } catch (e) {
        // We're on a browser that doesn't support this
        return "?MiB / ?MiB";
    }

    return `${Math.round(used)}MiB / ${Math.round(max)}MiB`;
}

function get_uptime() {
    let uptime_secs = (Date.now() - computer.boot_time) / 1000;
    let d = Math.floor(uptime_secs / (3600 * 24));
    let h = Math.floor(uptime_secs % (3600 * 24) / 3600);
    let m = Math.floor(uptime_secs % 3600 / 60);
    let s = Math.floor(uptime_secs % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    // Only display the seconds view if we're < 1 full minute of uptime
    let sDisplay = (m <= 0 && h <= 0 && d <= 0) ? (s > 0 ? s + (s == 1 ? " second" : " seconds") : "") : "";

    let output = dDisplay + hDisplay + mDisplay + sDisplay;

    // Use regex to remove any garbage whitespace or leading commas
    output = output.replace(/,\s*$/, "");

    return output;
}

export function main(args: string[]): number {
    let parser = new ArgParser({
        name: "neofetch",
        description: "A fast, highly customizable system info script",
        description_long: "Neofetch is a CLI system information tool written in BASH. Neofetch\n" +
            "displays information about your system next to an image, your OS logo,\n" +
            "or any ASCII file of your choice.",
        version: "0.0.1",
        print_function: print,
    });
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help()) {
        return 0;
    }

    const ascii = [
        "                         ",
        "       o@@@@@@@@@O.      ",
        "     o@@@@@@@@@@@@.      ",
        "     @@@@@@*°*o#@*       ",
        "     @@@@@@#*.           ",
        "     O@@@@@@@@@@@°       ",
        "       O@@@@@@@@@@@      ",
        "           .*@@@@@@°     ",
        "      @@#O***@@@@@@.     ",
        "     @@@@@@@@@@@@@o      ",
        "     o#@@@@@@@@@o        ",
        "                         ",
        "                         ",
    ];

    const make_colored_block = (color: string) => {
        // noinspection CssUnresolvedCustomProperty (Editor not realizing it's a template literal)
        return `<span style="color: var(--term-${color})">██</span>`;
    };

    let colored_blocks: string[][] = [[], []];

    for (
        let color of [
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "purple",
        "cyan",
        "white",
    ]
        ) {
        colored_blocks[0].push(make_colored_block(color));
    }

    for (
        let color of [
        "light-black",
        "light-red",
        "light-green",
        "light-yellow",
        "light-blue",
        "light-purple",
        "light-cyan",
        "light-white",
    ]
        ) {
        colored_blocks[1].push(make_colored_block(color));
    }

    // Start collecting info for the output


    const username = get_username();
    const shell = SHELLS[Math.floor(Math.random() * SHELLS.length)];
    const terminal = TERMINALS[Math.floor(Math.random() * TERMINALS.length)];
    const gpu = get_gpu(); // TODO: Fix this, its unreliable (doesn't work on my laptop)
    const memory = get_memory();
    const uptime = get_uptime();


    const info_lines = {
        1: `${username}@${computer.get_hostname()}`,
        2: "",
        3: `OS: ./steve.sh ${arch()}`,
        4: "Kernel: 5.18.9-hardened1-2-hardened",
        5: `Uptime: ${uptime}`, // TODO: Format this
        6: `Shell: ${shell}`,
        7: `Resolution: ${screen.width}x${screen.height}`,
        8: `Terminal: ${terminal}`,
        9: `CPU: Generic ${navigator.hardwareConcurrency}-core ${arch()}`,
        10: `GPU: ${gpu}`,
        11: `Memory: ${memory}`,
        12: `${colored_blocks[0].join("")}`,
        13: `${colored_blocks[1].join("")}`,
    };

    // We have to do this after info_lines is defined
    info_lines[2] = `${"-".repeat(info_lines[1].length)}`;

    for (let i = 0; i < ascii.length; i++) {
        // print(ascii[i], {font: "Liberation Mono", newline: false});
        print(ascii[i], {newline: false, escape_html: false, sanitize: true});
        // // print(ascii[i], {newline: false, sanitize: true, escape_html: false});
        // // @ts-ignore
        // info_lines[i+1] = info_lines[i+1].replaceAll(/\n/g, "<br>");
        // // @ts-ignore
        // info_lines[i+1] = info_lines[i+1].replaceAll(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        // // @ts-ignore
        // console.log(info_lines[i+1].match(/ /g));
        // // @ts-ignore
        // // info_lines[i+1] = info_lines[i+1].replaceAll(/ (?![^<]*>)/g, " ");
        // // console.log()
        // info_lines[i+1] = info_lines[i+1].replaceAll(/ /g, "&nbsp;");
        // @ts-ignore: Its hard coded, it'll be fine
        print(info_lines[i + 1], {sanitize: true, escape_html: false});
    }

    return 0;
}
