export function escape_html(msg: string): string {
    return msg.replaceAll(/</g, "&lt;").replace(/>/g, "&gt;");
}