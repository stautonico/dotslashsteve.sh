// import {print} from "../helpers/io";
// import {computer} from "../helpers/globals";
//
//
// export function main(args: string[]) {
//     // TODO: Build using "syscalls"
//     if (args.length < 1) {
//         print(`usage: cat [file]`, true);
//         return;
//     }
//
//     const file = args[0];
//     const find_file = computer.find(file);
//     if (find_file.fail()) {
//         print(`${file}: No such file or directory (os error 2)`);
//         return;
//     }
//
//     // @ts-ignore
//     let data = find_file.get_data()!.read().get_data();
//
//     data = data.replaceAll("\n", "<br />");
//     data = data.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
//     data = data.replaceAll(" ", "&nbsp;");
//
//     print(data);
//
// }
import {print, debug}  from "../helpers/io";
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
        print(`cat: a file is required`);
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
