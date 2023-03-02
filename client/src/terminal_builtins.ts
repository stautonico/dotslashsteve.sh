import {perror, print} from "./util/io";
import {ArgParser} from "./util/argparser";
import {Terminal} from "./terminal";
import {computer, PASS_THROUGH_INDICATOR} from "./util/globals";
import {chdir, getcwd} from "./lib/unistd";
import {setenv} from "./lib/stdlib";

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
                positional: true,
            },
        },
    });

    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help()) {
        return 0;
    }

    const result = chdir(parsed.get("directory"));

    if (!result) {
        perror("cd: Failed to change directory");
    }

    return 0;
}

export function history(_args: string[], _terminal: Terminal): number {
    // TODO: Implement some of history's arguments

    const history = computer.get_shell_history();

    for (let i = 0; i < history.length; i++) {
        print(`${i + 1} ${history[i]}`);
    }

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

    if (parsed.printed_version_or_help()) {
        return 0;
    }

    print(getcwd());

    return 0;
}

export function passthrough(args: string[], terminal: Terminal): number {
    const parser = new ArgParser({
        name: "passthrough",
        description: "Toggle the terminal pass-through mode",
        description_long:
            "Toggle the terminal's pass-through mode which allows keystrokes to be" +
            "passed through to the browser, rather than being intercepted",
        version: "0.0.1",
        print_function: print,
    });
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help()) {
        return 0;
    }

    terminal.pass_through_enabled = !terminal.pass_through_enabled;
    PASS_THROUGH_INDICATOR!.style.display = terminal.pass_through_enabled
        ? "block"
        : "none";

    return 0;
}

export function custom_export(args: string[], _terminal: Terminal): number {
    const parser = new ArgParser({
        name: "export",
        description: "Set an environment variable",
        description_long: "Set an environment variable",
        version: "0.0.1",
        print_function: print,
        args: {
            "value": {
                type: "string",
                required: true,
                description: "The key=value to set",
                positional: true,
            },
        },
    });
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help()) {
        return 0;
    }

    const [key, value] = parsed.get("value").split("=");

    setenv(key, value);

    return 0;
}

export function unset(args: string[], _terminal: Terminal): number {
    const parser = new ArgParser({
        name: "unset",
        description: "Unset an environment variable",
        description_long: "Unset an environment variable",
        version: "0.0.1",
        print_function: print,
        args: {
            "key": {
                type: "string",
                required: true,
                description: "The key to unset",
                positional: true,
            },
        },
    });
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help()) {
        return 0;
    }

    const key = parsed.get("key");

    computer.unset_env(key);

    return 0;
}