import {output_buffer} from "./globals";

export function print(msg: string, sanitize = false) {
    if (sanitize) {
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    output_buffer.push([msg]);
}