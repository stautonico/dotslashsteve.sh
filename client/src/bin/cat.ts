import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {read} from "../lib/unistd";

// TODO: Support cat-ing multiple files
export const parser = new ArgParser({
    name: "cat",
    description: "concatenate files and print on the standard output",
    description_long: "Concatenate FILE(s) to standard output.",
    version: "1.0.0",
    print_function: print,
    args: {
        "file": {
            description: "the name of the file to read",
            type: "string",
            required: true, // We don't support reading standard input
            positional: true
        },
        "show_all": {
            description: "equivalent to -vET",
            type: "boolean",
            short: "A",
            long: "show-all"
        },
        "number_nonblank": {
            description: "number nonempty output lines, overrides -n",
            short: "b",
            long: "number-nonblank",
            type: "boolean"
        },
        "lowercase_e": {
            description: "equivalent to -vE",
            short: "e",
            type: "boolean"
        },
        "show_ends": {
            description: "display $ at end of each line",
            short: "E",
            long: "show-ends",
            type: "boolean"
        },
        "number": {
            description: "number all output lines",
            short: "n",
            long: "number",
            type: "boolean"
        },
        "squeeze_blank": {
            description: "suppress repeated empty output lines",
            short: "s",
            long: "squeeze-blank",
            type: "boolean"
        },
        "lowercase_t": {
            description: "equivalent to -vT",
            short: "t",
            type: "boolean"
        },
        "show_tabs": {
            description: "display TAB characters as ^I",
            short: "T",
            long: "show-tabs",
            type: "boolean"
        },
        "unbuffered": {
            description: "(ignored)",
            short: "u",
            type: "boolean"
        },
        "show_nonprinting": {
            description: "use ^ and M- notation, except for LFD and TAB",
            short: "v",
            long: "show-nonprinting",
            type: "boolean"
        }
    }
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    let read_result = read(parsed.get("file"));

    if (!read_result) {
        perror(`cat: ${parsed.get("file")}`);
        return 1;
    }

    let options = {
        show_all: parsed.get("show_all"),
        number_nonblank: parsed.get("number_nonblank"),
        lowercase_e: parsed.get("lowercase_e"),
        show_ends: parsed.get("show_ends"),
        number: parsed.get("number"),
        squeeze_blank: parsed.get("squeeze_blank"),
        lowercase_t: parsed.get("lowercase_t"),
        show_tabs: parsed.get("show_tabs"),
        show_nonprinting: parsed.get("show_nonprinting")
    };

    if (options.show_all) {
        options.show_ends = true;
        options.show_tabs = true;
        options.show_nonprinting = true;
    }

    if (options.lowercase_e) {
        options.show_ends = true;
        options.show_nonprinting = true;
    }

    if (options.lowercase_t) {
        options.show_tabs = true;
        options.show_nonprinting = true;
    }

    // We put this first otherwise show_ends will override it
    if (options.squeeze_blank) {
        // If we have multiple newlines in a row, replace them with a single newline
        read_result = read_result.replaceAll(/\n{2,}/g, "\n\n");
    }

    if (options.show_ends) {
        let split_lines = read_result.split("\n");
        let new_lines = [];
        let line_number = 1;
        for (let line of split_lines) {
            if (line != "")
                new_lines.push(`${line_number} ${line}`);
            else
                new_lines.push(line);
            line_number++;
        }
        read_result = new_lines.join("\n");
    }

    if (options.show_tabs) {
        read_result = read_result.replaceAll("\n", "$\n");
    }

    if (options.number && !options.number_nonblank) {
        let split_lines = read_result.split("\n");
        let new_lines = [];
        let line_number = 1;
        for (let line of split_lines) {
            new_lines.push(`${line_number} ${line}`);
            line_number++;
        }
        read_result = new_lines.join("\n");
    }

    if (options.show_tabs) {
        read_result = read_result.replaceAll("\t", "^I");
    }

    if (options.show_nonprinting) {
        // TODO: Validate this, I'm just trusting what github copilot wrote
        read_result = read_result.replaceAll("\t", "^I");
        read_result = read_result.replaceAll("\r", "^M");
        read_result = read_result.replaceAll("\v", "^K");
        read_result = read_result.replaceAll("\f", "^L");
        read_result = read_result.replaceAll("\b", "^H");
        read_result = read_result.replaceAll("\0", "^@");
        read_result = read_result.replaceAll("\x1b", "^[");
    }

    print(read_result);

    return 0;
}
