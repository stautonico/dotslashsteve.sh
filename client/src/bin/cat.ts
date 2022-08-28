import {print}  from "../helpers/io";
import {read} from "../lib/unistd";
import {ArgParser} from "../helpers/argparser";
import {stat} from "../lib/sys/stat";

export function main(args: string[]) {
    let parser = new ArgParser({
        name: "cat",
        description: "concatenate files and print on the standard output",
        description_long: "concatenate files and print on the standard output",
        version: "0.0.1",
        print_function: print,
        args: {
            "file": {
                description: "the file to print",
                type: "string",
                required: true
            }
        }
    });
    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return;

    if (!parsed.has("file")) {
        print("cat: a file is required");
        return;
    }

    let filepath = parsed.get("file");

    let stat_result = stat(filepath);

    if (stat_result === undefined) {
        print(`cat: ${filepath}: No such file or directory`);
        return;
    }

    let data = read(filepath);

    if (data === undefined) {
        print(`cat: ${filepath}: Permission denied`);
        return;
    }

    print(data);
}
