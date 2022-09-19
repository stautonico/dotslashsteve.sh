import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {read} from "../lib/unistd";

// TODO: Add flags
export const parser = new ArgParser({
    name: "head",
    description: "output the first part of files",
    description_long: "output the first part of files",
    version: "0.0.1",
    print_function: print,
    args: {
        "file": {
            description: "the name of the file to read",
            type: "string",
            required: true, // We don't support reading standard input
            positional: true
        }
    }
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    let read_result = read(parsed.get("file"));

    if (!read_result) {
        perror(`head: ${parsed.get("file")}`);
        return 1;
    }

    let lines = read_result.split("\n").slice(0, 10);

    print(lines.join("\n"));

    return 0;
}