import {print}  from "../helpers/io";
import {computer} from "../helpers/globals";

function format_uptime() {
    // Example output:
    // 21:31:53 up 341 days, 12:04,  1 user,  load average: 0.09, 0.02, 0.01
    // 17:32:11 up  1:43,  1 user,  load average: 2.55, 2.09, 1.78
    let uptime_secs = (Date.now() - computer.boot_time) / 1000;
    let d = Math.floor(uptime_secs / (3600 * 24));
    let h = Math.floor(uptime_secs % (3600 * 24) / 3600);
    let m = Math.floor(uptime_secs % 3600 / 60);
    let s = Math.floor(uptime_secs % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    // Only display the seconds view if we're < 1 full minute of uptime
    let sDisplay = (m <= 0 && h <= 0 && d <= 0) ? (s > 0 ? s + (s == 1 ? " second" : " seconds") : "") : "";

    let output = dDisplay + hDisplay + mDisplay + sDisplay;

    // Use regex to remove any garbage whitespace or leading commas
    output = output.replace(/,\s*$/, "");

    return output;
}

export function main(_args: string[]): number {
    print(`uptime: ${format_uptime()}`)

    return 0;
}