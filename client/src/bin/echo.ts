import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {read} from "../lib/unistd";
import {getenv} from "../lib/stdlib";

// TODO: Add flags
export const parser = new ArgParser({
    name: "echo",
    description: "display a line of text",
    description_long: "Echo the STRING(s) to standard output",
    version: "0.0.1",
    print_function: print,
    args: {
        "string": {
            description: "the string to print",
            type: "string",
            required: true, // We don't support reading standard input
            positional: true
        },
        "nonewline": {
            description: "do not output the trailing newline",
            type: "boolean",
        }
    }
});

export function main(args: string[]): number {
    // TODO: Figure out a way to do this with arg parser

    let nonewline = false;

    if (args.includes("-n")) {
        nonewline = true;
        while (args.indexOf("-n") > -1) {
            args.splice(args.indexOf("-n"), 1);
        }
    }



    let clean_args: string[] = [];

    for (let word of args) {
        if (word[0] === "$") {
            let env_var = getenv(word.replaceAll("$", ""));
            if (env_var) clean_args.push(env_var);
        } else {
            clean_args.push(word);
        }
    }

    let output_text = clean_args.join(" ");

    if (nonewline) {
        if (output_text.endsWith("\n")) {
            output_text = output_text.slice(0, -1);
        }
    }

    // TODO: Implement escape argument

    print(output_text);

    return 0;
}