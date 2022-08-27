export function escape_html(msg: string): string {
    return msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}