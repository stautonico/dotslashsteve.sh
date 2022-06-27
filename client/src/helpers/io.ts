import {output_buffer} from "./globals";

export function print(msg: string, sanitize = true) {
    if (sanitize) {
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        msg = msg.replaceAll("\n", "<br />");
        msg = msg.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
        msg = msg.replaceAll(" ", "&nbsp;");
    }


    output_buffer.push([msg]);
}

export function debug(msg: any) {
    if (typeof msg === "object")
        msg = JSON.stringify(msg); // So we can see objects without seeing "[object Object]"
    print(`<span style="color: #7b00ff;">[DEBUG]</span>: ${msg}`, false);
}