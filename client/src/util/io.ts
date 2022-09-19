import {computer, OUTPUT_BUFFER, SETTINGS} from "./globals";

interface PrintOptions {
    escape_html?: boolean, // Whether to sanitize the message (Remove html tags) |  Default - True
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
    if (options.escape_html === undefined) options.escape_html = false;
    if (options.newline === undefined) options.newline = true;

    // TODO: Check if we're in a pipe and if so, print to the pipe buffer instead of the output buffer

    // TODO: Solve the problem of having to use the reset multiple times
    // Handle ansi escape codes
    // Regular colors
    msg = msg.replaceAll("\\e[0;30m", "<span style='color: var(--term-black)'>");
    msg = msg.replaceAll("\\e[0;31m", "<span style='color: var(--term-red)'>");
    msg = msg.replaceAll("\\e[0;32m", "<span style='color: var(--term-green)'>");
    msg = msg.replaceAll("\\e[0;33m", "<span style='color: var(--term-yellow)'>");
    msg = msg.replaceAll("\\e[0;34m", "<span style='color: var(--term-blue)'>");
    msg = msg.replaceAll("\\e[0;35m", "<span style='color: var(--term-purple)'>");
    msg = msg.replaceAll("\\e[0;36m", "<span style='color: var(--term-cyan)'>");
    msg = msg.replaceAll("\\e[0;37m", "<span style='color: var(--term-white)'>");

    // Bold colors
    msg = msg.replaceAll("\\e[1;30m", "<span style='font-weight: bold; color: var(--term-black)'>");
    msg = msg.replaceAll("\\e[1;31m", "<span style='font-weight: bold; color: var(--term-red)'>");
    msg = msg.replaceAll("\\e[1;32m", "<span style='font-weight: bold; color: var(--term-green)'>");
    msg = msg.replaceAll("\\e[1;33m", "<span style='font-weight: bold; color: var(--term-yellow)'>");
    msg = msg.replaceAll("\\e[1;34m", "<span style='font-weight: bold; color: var(--term-blue)'>");
    msg = msg.replaceAll("\\e[1;35m", "<span style='font-weight: bold; color: var(--term-purple)'>");
    msg = msg.replaceAll("\\e[1;36m", "<span style='font-weight: bold; color: var(--term-cyan)'>");
    msg = msg.replaceAll("\\e[1;37m", "<span style='font-weight: bold; color: var(--term-white)'>");

    // Underline colors
    msg = msg.replaceAll("\\e[4;30m", "<span style='text-decoration: underline; color: var(--term-black)'>");
    msg = msg.replaceAll("\\e[4;31m", "<span style='text-decoration: underline; color: var(--term-red)'>");
    msg = msg.replaceAll("\\e[4;32m", "<span style='text-decoration: underline; color: var(--term-green)'>");
    msg = msg.replaceAll("\\e[4;33m", "<span style='text-decoration: underline; color: var(--term-yellow)'>");
    msg = msg.replaceAll("\\e[4;34m", "<span style='text-decoration: underline; color: var(--term-blue)'>");
    msg = msg.replaceAll("\\e[4;35m", "<span style='text-decoration: underline; color: var(--term-purple)'>");
    msg = msg.replaceAll("\\e[4;36m", "<span style='text-decoration: underline; color: var(--term-cyan)'>");
    msg = msg.replaceAll("\\e[4;37m", "<span style='text-decoration: underline; color: var(--term-white)'>");

    // Background colors
    msg = msg.replaceAll("\\e[40m", "<span style='background-color: var(--term-black)'>");
    msg = msg.replaceAll("\\e[41m", "<span style='background-color: var(--term-red)'>");
    msg = msg.replaceAll("\\e[42m", "<span style='background-color: var(--term-green)'>");
    msg = msg.replaceAll("\\e[43m", "<span style='background-color: var(--term-yellow)'>");
    msg = msg.replaceAll("\\e[44m", "<span style='background-color: var(--term-blue)'>");
    msg = msg.replaceAll("\\e[45m", "<span style='background-color: var(--term-purple)'>");
    msg = msg.replaceAll("\\e[46m", "<span style='background-color: var(--term-cyan)'>");
    msg = msg.replaceAll("\\e[47m", "<span style='background-color: var(--term-white)'>");

    // Light/high intensity colors
    msg = msg.replaceAll("\\e[0;90m", "<span style='color: var(--term-light-black)'>");
    msg = msg.replaceAll("\\e[0;91m", "<span style='color: var(--term-light-red)'>");
    msg = msg.replaceAll("\\e[0;92m", "<span style='color: var(--term-light-green)'>");
    msg = msg.replaceAll("\\e[0;93m", "<span style='color: var(--term-light-yellow)'>");
    msg = msg.replaceAll("\\e[0;94m", "<span style='color: var(--term-light-blue)'>");
    msg = msg.replaceAll("\\e[0;95m", "<span style='color: var(--term-light-purple)'>");
    msg = msg.replaceAll("\\e[0;96m", "<span style='color: var(--term-light-cyan)'>");
    msg = msg.replaceAll("\\e[0;97m", "<span style='color: var(--term-light-white)'>");

    // Light/high intensity bold colors
    msg = msg.replaceAll("\\e[1;90m", "<span style='font-weight: bold; color: var(--term-light-black)'>");
    msg = msg.replaceAll("\\e[1;91m", "<span style='font-weight: bold; color: var(--term-light-red)'>");
    msg = msg.replaceAll("\\e[1;92m", "<span style='font-weight: bold; color: var(--term-light-green)'>");
    msg = msg.replaceAll("\\e[1;93m", "<span style='font-weight: bold; color: var(--term-light-yellow)'>");
    msg = msg.replaceAll("\\e[1;94m", "<span style='font-weight: bold; color: var(--term-light-blue)'>");
    msg = msg.replaceAll("\\e[1;95m", "<span style='font-weight: bold; color: var(--term-light-purple)'>");
    msg = msg.replaceAll("\\e[1;96m", "<span style='font-weight: bold; color: var(--term-light-cyan)'>");
    msg = msg.replaceAll("\\e[1;97m", "<span style='font-weight: bold; color: var(--term-light-white)'>");

    // TODO: "dim colors"
    // TODO: blinking

    // Remove color: \e[0m
    msg = msg.replaceAll("\\e[0m", "</span>");

    if (options.font) {
        msg = `<span style="font-family: ${options.font}">${msg}</span>`;
    }

    if (options.escape_html) {
        msg = msg.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
    }

    if (options.sanitize) {
        msg = msg.replaceAll(/\n/g, "<br>");
        msg = msg.replaceAll(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        if (!options.escape_html)
            // Match all spaces that is not contained in a tag
            msg = msg.replaceAll(/ (?![^<]*>)/g, "&nbsp;");
        else
            msg = msg.replaceAll(/ /g, "&nbsp;");
    }

    OUTPUT_BUFFER.push(msg);


    if (options.newline) OUTPUT_BUFFER.push("<br />");
}

export function debug(msg: object | string | number | boolean) {
    if (SETTINGS.debug) {
        if (typeof msg === "object")
            msg = JSON.stringify(msg); // So we can see objects without seeing "[object Object]"
        print(`<span style="color: var(--term-debug-color);">[DEBUG]</span>: ${msg}`, {sanitize: false});
    }
}

export function perror(msg: string) {
    // Look up our current errno value
    let errno_message = "";

    if (computer.get_errno().number == 0) {
        errno_message = "Success";
    } else {
        errno_message = computer.get_errno().message;
    }

    print(`${msg}: ${errno_message}`);
}
