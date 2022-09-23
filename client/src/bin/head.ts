import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {read} from "../lib/unistd";

/*
TODO:
       -z, --zero-terminated
              line delimiter is NUL, not newline

TODO:
       NUM  may  have a multiplier suffix: b 512, kB 1000, K 1024, MB 1000*1000, M 1024*1024, GB 1000*1000*1000, G 1024*1024*1024, and so on for T,
       P, E, Z, Y.  Binary prefixes can be used, too: KiB=K, MiB=M, and so on.


 */
// TODO: Can't use -n for bytes or lines because argparser detects it as a flag
export const parser = new ArgParser({
    name: "head",
    description: "output the first part of files",
    description_long: "Print the first 10 lines of each FILE to standard output.  With more than one FILE, precede each with a header giving the file name.",
    version: "1.0.0q",
    print_function: print,
    args: {
        "file": {
            description: "the name of the file to read",
            type: "string",
            required: true, // We don't support reading standard input
            positional: true
        },
        "bytes": {
            description: "print the first NUM bytes of each file; with the leading '-', print all but the last NUM bytes of each file",
            short: "c",
            long: "bytes",
            type: "int",
        },
        "lines": {
            description: "print the first NUM lines instead of the first 10; with the leading '-', print all but the last NUM lines of each file",
            short: "n",
            long: "lines",
            type: "int",
        },
        "quiet": {
            description: "never print headers giving file names",
            short: "q",
            long: ["quiet", "silent"],
            type: "boolean",
        },
        "verbose": {
            description: "always print headers giving file names",
            short: "v",
            long: "verbose",
            type: "boolean",
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

    // Quiet overwrites verbose
    if (parsed.get("verbose") && !parsed.get("quiet")) {
        print(`==> ${parsed.get("file")} <==`);
    }

    if (parsed.has("bytes")) {
        print(read_result.substring(0, parsed.get("bytes")), {newline: false});
        return 0;
    }

    if (parsed.has("lines")) {
        const lines = read_result.split("\n");
        print(lines.slice(0, parsed.get("lines")).join("\n"), {newline: false});
        return 0;
    }

    let lines = read_result.split("\n").slice(0, 10);

    print(lines.join("\n"), {newline: false});

    return 0;
}
