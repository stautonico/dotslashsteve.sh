import {print} from "../util/io";
import {ArgParser} from "../util/argparser";
import {computer} from "../util/globals";
import {arch} from "../util/arch";
import {getenv} from "../lib/stdlib";

export const parser = new ArgParser({
    name: "neofetch",
    description: "A fast, highly customizable system info script",
    description_long: "Neofetch is a CLI system information tool written in BASH. Neofetch\n" +
        "displays information about your system next to an image, your OS logo,\n" +
        "or any ASCII file of your choice.",
    version: "0.0.1",
    print_function: print,
});

function get_username() {
    const current_session = computer.current_session();
    const uid = current_session.get_effective_uid();
    const user = computer.get_user({uid});
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
    let uptime_secs = (Date.now() - computer.get_boot_time()) / 1000;
    let day = Math.floor(uptime_secs / (3600 * 24));
    let hour = Math.floor(uptime_secs % (3600 * 24) / 3600);
    let minute = Math.floor(uptime_secs % 3600 / 60);
    let second = Math.floor(uptime_secs % 60);

    let dayString = day > 0 ? day + (day == 1 ? " day, " : " days, ") : "";
    let hourString = hour > 0 ? hour + (hour == 1 ? " hour, " : " hours, ") : "";
    let minuteString = minute > 0 ? minute + (minute == 1 ? " min, " : " mins, ") : "";

    // Only display the seconds view if we're < 1 full minute of uptime
    let secondString = (minute <= 0 && hour <= 0 && day <= 0) ? (second > 0 ? second + (second == 1 ? " second" : " seconds") : "") : "";

    let output = dayString + hourString + minuteString + secondString;

    // Use regex to remove any garbage whitespace or leading commas
    output = output.replace(/,\s*$/, "");

    return output;
}

export function main(args: string[]): number {
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
    const shell = getenv("SHELL") || "?";
    const terminal = getenv("TERM") || "?";
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
        print(ascii[i], {newline: false, escape_html: false, sanitize: true});
        // @ts-ignore: Its hard coded, it'll be fine
        print(info_lines[i + 1], {sanitize: true, escape_html: false});
    }

    return 0;
}