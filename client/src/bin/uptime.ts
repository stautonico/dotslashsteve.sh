import {print} from "../helpers/io";
import {computer} from "../helpers/globals";

function format_uptime() {
    // Example output:
    // 21:31:53 up 341 days, 12:04,  1 user,  load average: 0.09, 0.02, 0.01
    // 17:32:11 up  1:43,  1 user,  load average: 2.55, 2.09, 1.78
    let uptime_secs = (Date.now() - computer.boot_time) / 1000;
    let day = Math.floor(uptime_secs / (3600 * 24));
    let hour = Math.floor(uptime_secs % (3600 * 24) / 3600);
    let minute = Math.floor(uptime_secs % 3600 / 60);
    let second = Math.floor(uptime_secs % 60);
    const pad_number = (number: number) => {
        if (number >= 10) {
            return `${number}`;
        } else {
            return `0${number}`;
        }
    };

    let output = `${pad_number(hour)}:${pad_number(minute)}:${pad_number(second)} `;

    if (day > 0) {
        output += day > 0 ? day + (day == 1 ? " day" : " days") : "";
    }


    // TODO: Add user count + load average (maybe make up numbers?)


    // Use regex to remove any garbage whitespace or leading commas
    output = output.replace(/,\s*$/, "");

    return output;
}

export function main(_args: string[]): number {
    print(`uptime: ${format_uptime()}`);

    return 0;
}