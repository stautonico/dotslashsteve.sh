import {print} from "./helpers/io";
import {ArgParser} from "./helpers/argparser";
import {Terminal} from "./terminal";
import {output_buffer, computer} from "./helpers/globals";
import {stat, ISDIR} from "./lib/sys/stat";
import {chdir, getcwd} from "./lib/unistd";

export function cd(args: string[], terminal: Terminal): number {
    let parser = new ArgParser({
        name: "cd",
        description: "change working directory",
        description_long: "change working directory",
        version: "0.0.1",
        print_function: print,
        args: {
            "directory": {
                description: "the directory to change to",
                type: "string",
                required: true,
            }
        }
    });

    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    // Make sure the directory exists
    let stat_result = stat(parsed.get("directory"));

    if (stat_result === undefined) {
        print(`cd: ${parsed.get("directory")}: No such file or directory`);
        return 1;
    }

    if (!ISDIR(parsed.get("directory"))) {
        print(`cd: ${parsed.get("directory")}: Not a directory`);
        return 1;
    }

    let result = chdir(parsed.get("directory"));

    if (!result) {
        print(`cd: ${parsed.get("directory")}: Permission denied`);
        return 1;
    }

    return 0;
}


export function clear(args: string[], terminal: Terminal): number {
    let parser = new ArgParser({
        name: "clear",
        description: "clear the terminal screen",
        description_long: "clear the terminal screen",
        version: "0.0.1",
        print_function: print,
    });
    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;


    output_buffer.splice(0, output_buffer.length);

    return 0;
}

export function history(args: string[], terminal: Terminal): number {
    // TODO: Implement some of history's arguments

    let history = computer.get_input_history();

    for (let i = 0; i < history.length; i++)
        print(`${i + 1} ${history[i]}`);

    return 0;
}


export function pwd(args: string[], terminal: Terminal): number {
    let parser = new ArgParser({
        name: "pwd",
        description: "print name of current/working directory",
        description_long: "print name of current/working directory",
        version: "0.0.1",
        print_function: print,
    });
    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;


    print(getcwd());

    return 0;
}