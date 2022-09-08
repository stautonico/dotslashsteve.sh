import {perror, print} from "./util/io";
import {ArgParser} from "./util/argparser";
import {Terminal} from "./terminal";
import {computer, PASS_THROUGH_INDICATOR} from "./util/globals";
import {stat, ISDIR} from "./lib/sys/stat";
import {chdir, getcwd} from "./lib/unistd";

export function cd(args: string[], _terminal: Terminal): number {
    const parser = new ArgParser({
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
                positional: true
            }
        }
    });

    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    const result = chdir(parsed.get("directory"));

    if (!result) {
        perror("cd: Failed to change directory");

    }

    return 0;


    // // Make sure the directory exists
    // const stat_result = stat(parsed.get("directory"));
    //
    // if (stat_result === undefined) {
    //     print(`cd: ${parsed.get("directory")}: No such file or directory`);
    //     return 1;
    // }
    //
    // if (!ISDIR(parsed.get("directory"))) {
    //     print(`cd: ${parsed.get("directory")}: Not a directory`);
    //     return 1;
    // }
    //
    // const result = chdir(parsed.get("directory"));
    //
    // if (!result) {
    //     print(`cd: ${parsed.get("directory")}: Permission denied`);
    //     return 1;
    // }
    //
    // return 0;
}

export function history(_args: string[], _terminal: Terminal): number {
    // TODO: Implement some of history's arguments

    const history = computer.get_input_history();

    for (let i = 0; i < history.length; i++)
        print(`${i + 1} ${history[i]}`);

    return 0;
}


export function pwd(args: string[], _terminal: Terminal): number {
    const parser = new ArgParser({
        name: "pwd",
        description: "print name of current/working directory",
        description_long: "print name of current/working directory",
        version: "0.0.1",
        print_function: print,
    });
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;


    print(getcwd());

    return 0;
}

export function passthrough(args: string[], terminal: Terminal): number {
    const parser = new ArgParser({
        name: "passthrough",
        description: "Toggle the terminal pass-through mode",
        description_long: "Toggle the terminal's pass-through mode which allows keystrokes to be" +
            "passed through to the browser, rather than being intercepted",
        version: "0.0.1",
        print_function: print,
    });
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;


    terminal.pass_through_enabled = !terminal.pass_through_enabled;
    PASS_THROUGH_INDICATOR!.style.display = terminal.pass_through_enabled ? "block" : "none";

    return 0;
}