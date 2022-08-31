import {FSBaseObject} from "../fs/inode";

// File listener callbacks
export function termprefs_write_handler(file: FSBaseObject) {
    // Parse the json input
    let json;
    try {
        // @ts-ignore
        json = JSON.parse(file.get_content());
    } catch (e) {
        // If we fail, just exit
        return
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
