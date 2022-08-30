import {OUTPUT_BUFFER} from "./globals";
import {EscapedElement} from "../html_tags";

interface PrintOptions {
    sanitize_html?: boolean, // Whether to sanitize the message (Remove html tags) |  Default - True
    sanitize?: boolean, // Whether to sanitize special characters (spaces, tabs, newlines) | Default - True
    newline?: boolean, // Whether to add a newline after the message | Default - True
    font?: string, // The font to use | Default - default terminal font
}

export function print(msg?: string, options?: PrintOptions) {
    // If we passed no message, just print a newline
    if (!msg) msg = "";

    if (options === undefined) options = {};
    // Set the defaults
    if (options.sanitize === undefined) options.sanitize = true;
    if (options.sanitize_html === undefined) options.sanitize_html = false;
    if (options.newline === undefined) options.newline = true;

    // TODO: Check if we're in a pipe and if so, print to the pipe buffer instead of the output buffer

    if (options.sanitize_html) {
        if (options.sanitize_html)
            msg = msg.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");

        if (options.font) {
            msg = `<span style="font-family: ${options.font}">${msg}</span>`;
        }
        OUTPUT_BUFFER.push(msg);
    } else {
        if (options.sanitize) {
            msg = msg.replace(/\n/g, "<br>");
            msg = msg.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
            if (!options.sanitize_html)
                // Match all spaces that is not contained in a tag
                msg = msg.replace(/ (?![^<]*>)/g, " ");
            else
                msg = msg.replace(/ /g, "&nbsp;");

        }

        for (let i = 0; i < msg.length; i++) {
            OUTPUT_BUFFER.push(msg[i]);
        }
    }

    // if (options.sanitize_html)
    //     msg = msg.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
    //
    //
    // if (options.sanitize) {
    //     msg = msg.replace(/\n/g, "<br>");
    //     msg = msg.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    //     if (!options.sanitize_html)
    //         // Match all spaces that is not contained in a tag
    //         msg = msg.replace(/ (?![^<]*>)/g, " ");
    //     else
    //         msg = msg.replace(/ /g, "&nbsp;");
    //
    // }
    //
    // if (options.font) {
    //     msg = `<span style="font-family: ${options.font}">${msg}</span>`;
    // }

    // We're going to append content to the output buffer one character at a time
    // unless it's an HTML tag, in which case we'll append the whole tag at once


    // OUTPUT_BUFFER.push(msg);
    if (options.newline) OUTPUT_BUFFER.push("<br />");
}

export function debug(msg: object | string | number | boolean) {
    if (typeof msg === "object")
        msg = JSON.stringify(msg); // So we can see objects without seeing "[object Object]"
    print(`<span style="color: var(--term-debug-color);">[DEBUG]</span>: ${msg}`, {sanitize: false});
}