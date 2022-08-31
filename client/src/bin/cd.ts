import {print} from "../helpers/io";
import {ArgParser} from "../helpers/argparser";
import {stat, ISDIR} from "../lib/sys/stat";
import {chdir} from "../lib/unistd";

export function main(args: string[]): number {
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