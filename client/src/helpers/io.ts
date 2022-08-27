import {output_buffer} from "./globals";

let PREV_SKIP_NEWLINE = false; // If the previous output had newline = false,
// the next line will print into the previous buffer

interface PrintOptions {
    sanitize_html?: boolean, // Whether to sanitize the message (Remove html tags) |  Default - True
    sanitize?: boolean, // Whether to sanitize special characters (spaces, tabs, newlines) | Default - True
    newline?: boolean, // Whether to add a newline after the message | Default - True
    font?: string, // The font to use | Default - default terminal font
}

export function print(msg: string, options: PrintOptions = {}) {
    // Set the defaults
    if (options.sanitize === undefined) options.sanitize = true;
    if (options.sanitize_html === undefined) options.sanitize_html = true;
    if (options.newline === undefined) options.newline = true;
    // TODO: Push message to output buffer to allow for pipes (|) and redirection (< & >)
    if (options.sanitize_html)
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (options.sanitize) {
        msg = msg.replace(/\n/g, "<br>");
        msg = msg.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        if (!options.sanitize_html)
            // Match all spaces that is not contained in a tag
            msg = msg.replace(/ (?![^<]*>)/g, " ");
        else
            msg = msg.replace(/ /g, "&nbsp;");

    }


    if (options.font) {
        msg = `<span style="font-family: ${options.font}">${msg}</span>`;
    }


    if (PREV_SKIP_NEWLINE) {
        output_buffer[output_buffer.length -1][0] += msg;
        PREV_SKIP_NEWLINE = false;

    } else {
        output_buffer.push([msg]);
    }

    // This has to be after the print statement because it must run for the NEXT print statement
    // not the current one
    if (options.newline === false) {
        PREV_SKIP_NEWLINE = true;
    }
}

export function debug(msg: any) {
    if (typeof msg === "object")
        msg = JSON.stringify(msg); // So we can see objects without seeing "[object Object]"
    print(`<span style="color: #7b00ff;">[DEBUG]</span>: ${msg}`, {sanitize: false});
}