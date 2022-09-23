import {File, FSBaseObject} from "../fs/inode";
import {computer} from "./globals";

// File listener callbacks
export function termprefs_write_handler(file: FSBaseObject) {
    // Parse the json input
    let json;
    try {
        // @ts-ignore
        json = JSON.parse(file.get_content());
    } catch (e) {
        // If we fail, just exit
        return;
    }

    // Set the terminal colors
    let root = document.querySelector(":root");
    if ("colors" in json) {
        for (let key in json["colors"])
            // @ts-ignore
            root.style.setProperty("--term-" + key, json["colors"][key]);
    }

    // Set the font (if it's there)
    if ("font" in json) {
        // @ts-ignore
        root.style.setProperty("--term-font", json["font"]);
    }

    // Set the font size (if it's there)
    if ("font-size" in json) {
        // @ts-ignore
        root.style.setProperty("--term-font-size", json["font-size"]);
    }
}


export function proc_uptime_read_handler(file: FSBaseObject) {
    let uptime = computer.get_uptime();

    // @ts-ignore
    // The computer has had 0 idle time (lol) (second number)
    file.set_content(`${uptime} 0.0`);
}
