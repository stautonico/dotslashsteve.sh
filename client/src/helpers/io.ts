import {output_buffer} from "./globals";

export function print(msg: string, sanitize = true) {
    // TODO: Push message to output buffer to allow for pipes (|) and redirection (< & >)
    if (sanitize) {
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        msg = msg.replace(/\n/g, "<br>");
        msg = msg.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        msg = msg.replace(/ /g, "&nbsp;");
    }


    output_buffer.push([msg]);
}

export function debug(msg: any) {
    if (typeof msg === "object")
        msg = JSON.stringify(msg); // So we can see objects without seeing "[object Object]"
    print(`<span style="color: #7b00ff;">[DEBUG]</span>: ${msg}`, false);
}