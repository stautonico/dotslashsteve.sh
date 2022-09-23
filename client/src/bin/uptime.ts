import {print} from "../util/io";
import {computer} from "../util/globals";
import {ArgParser} from "../util/argparser";

export const parser = new ArgParser({
    name: "uptime",
    description: "Tell how long the system has been running",
    description_long: "uptime  gives  a  one line display of the following information.  The current time, how long the system has been running",
    version: "1.0.0",
    print_function: print,
    args: {
        "pretty": {
            description: "show uptime in a pretty format",
            short: "p",
            long: "pretty",
            type: "boolean",
        },
        "since": {
            description: "system up since, in yyyy-mm-dd HH:MM:SS format",
            short: "s",
            long: "since",
            type: "boolean",
        }
    }
});

const pad_number = (number: number) => {
    if (number >= 10) {
        return `${number}`;
    } else {
        return `0${number}`;
    }
};

function format_uptime() {
    let uptime_secs = (Date.now() - computer.get_boot_time()) / 1000;
    let day = Math.floor(uptime_secs / (3600 * 24));
    let hour = Math.floor(uptime_secs % (3600 * 24) / 3600);
    let minute = Math.floor(uptime_secs % 3600 / 60);

    let output = "";

    // Insert the current time into the output
    let current_time = new Date();
    output += `${pad_number(current_time.getHours())}:${pad_number(current_time.getMinutes())}:${pad_number(current_time.getSeconds())} `;

    output += "up ";

    if (day > 0) {
        output += `${day} day${day == 1 ? "" : "s"}, `;
    }


    if (hour == 0) {
        output += `${minute} min`;
    } else {
        output += ` ${hour}:${pad_number(minute)},  `;
    }

    // TODO: Insert the user count
    output += " 1 user,  load average: 0.00, 0.00, 0.00";


    return output;
}

function format_since() {
    let boot_time = computer.get_boot_time();
    let date = new Date(boot_time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${year}-${pad_number(month)}-${pad_number(day)} ${pad_number(hour)}:${pad_number(minute)}:${pad_number(second)}`;
}

function format_pretty() {
    let uptime_secs = (Date.now() - computer.get_boot_time()) / 1000;
    // Format seconds in decades, years, weeks, days, hours, minutes
    let decades = Math.floor(uptime_secs / (3600 * 24 * 365 * 10));
    let years = Math.floor(uptime_secs % (3600 * 24 * 365 * 10) / (3600 * 24 * 365));
    let weeks = Math.floor(uptime_secs % (3600 * 24 * 365) / (3600 * 24 * 7));
    let days = Math.floor(uptime_secs % (3600 * 24 * 7) / (3600 * 24));
    let hours = Math.floor(uptime_secs % (3600 * 24) / 3600);
    let minutes = Math.floor(uptime_secs % 3600 / 60);


    let output = "up ";

    if (decades > 0) output += decades + (decades == 1 ? " decade" : " decades") + ", ";
    if (years > 0) output += years + (years == 1 ? " year" : " years") + ", ";
    if (weeks > 0) output += weeks + (weeks == 1 ? " week" : " weeks") + ", ";
    if (days > 0) output += days + (days == 1 ? " day" : " days") + ", ";
    if (hours > 0) output += hours + (hours == 1 ? " hour" : " hours") + ", ";
    if (minutes > 0) output += minutes + (minutes == 1 ? " minute" : " minutes") + ", ";

    // If the output contains nothing but "up ", then the system has been up for less than a minute
    if (output == "up ") {
        output += "0 minutes";
    }

    // Use regex to remove any garbage whitespace or leading commas
    output = output.replace(/,\s*$/, "");

    return output;
}

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    if (parsed.get("since")) {
        print(format_since());
        return 0;
    }

    if (parsed.get("pretty")) {
        print(format_pretty());
        return 0;
    }


    print(format_uptime());

    return 0;
}
