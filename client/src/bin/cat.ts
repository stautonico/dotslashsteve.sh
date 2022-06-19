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
import {print}  from "../helpers/io";
import {computer} from "../helpers/globals";
import {ArgParser} from "../helpers/argparser";

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

    print(`If this was implemented, we would print ${parsed.file}`);
}
