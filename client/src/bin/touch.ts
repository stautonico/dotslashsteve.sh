import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {open_mode, open} from "../lib/unistd";

export const parser = new ArgParser({
    name: "touch",
    description: "change file timestamps",
    description_long: ` A FILE argument that does not exist is created empty, unless -c or -h is supplied.

A FILE argument string of - is handled specially and causes touch to change the times of the file associated with standard output.

Mandatory arguments to long options are mandatory for short options too.
`,
    version: "0.0.1",
    print_function: print,
    args: {
        "file": {
            description: "the name of the file to touch",
            type: "string",
            required: true, // We don't support reading standard input
            positional: true
        },
        "access": {
            description: "change only the access time",
            short: "a",
            type: "boolean"
        },
        "no_create": {
            description: "do not create any files",
            short: "c",
            long: "no-create",
            type: "boolean"
        }
    }
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    // Try to open the file
    if (!parsed.get("no_create")) {
        let fd = open(parsed.get("file"), open_mode.O_CREAT, 0o666);
        if (fd < 0) {
            perror("touch");
            return 1;
        }
    }



    return 0;
}
