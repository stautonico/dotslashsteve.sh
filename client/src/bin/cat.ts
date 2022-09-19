import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {read} from "../lib/unistd";

// TODO: Add flags
export const parser = new ArgParser({
    name: "cat",
    description: "concatenate files and print on the standard output",
    description_long: "concatenate files and print on the standard output",
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
        perror(`cat: ${parsed.get("file")}`);
        return 1;
    }

    print(read_result);

    return 0;
}