import {print, debug} from "../helpers/io";
import {computer} from "../helpers/globals";
import {ArgParser} from "../helpers/argparser";
import {readdir} from "../lib/dirent";
import {stat, ISDIR} from "../lib/sys/stat";

function make_directory_text(directory: string): string {
    return `<span style="color: var(--term-blue)">${directory}</span>`;
}

export function OLD_main(args: string[]) {
    // TODO: Build using "syscalls"
    let to_lookup;
    if (args.length > 0) {
        to_lookup = computer.find(args[0]);
    } else {
        to_lookup = computer.find(computer.getcwd());
    }

    if (to_lookup.fail()) {
        print(`${args[0]}: No such file or directory (os error 2)`);
    }


    // TODO: Support args
    if (to_lookup.get_data()!.is_file()) {
        print(to_lookup.get_data()!.get_name());
    }

    // @ts-ignore
    let files = to_lookup.get_data()!.get_children();

    // @ts-ignore
    files = files.map((file) => {
        if (file.get_name() !== "." && file.get_name() !== "..") {
            if (file.is_directory())
                return make_directory_text(file.get_name());
            else
                return file.get_name();
        }
    });

    let output = files.join(" ");

    // for (let file of files) {
    //     output += file.get_name() + "\n";
    // }

    print(output);
}

export function main(args: string[]) {
    let parser = new ArgParser({
        name: "ls",
        description: "list directory contents",
        description_long: "list directory contents",
        version: "0.0.1",
        print_function: print,
        args: {
            "directory": {
                description: "the directory to list",
                type: "string",
                required: false,
                default: computer.getcwd()
            },
            "long": {
                description: "list in long format",
                type: "boolean",
                required: false,
                short: "l",
            },
            "all": {
                description: "list all files, including hidden files",
                type: "boolean",
                required: false,
                short: "a",
                long: "all"
            }
        }
    });

    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return;
    
    let result = readdir(parsed.get("directory")) ?? [];

    if (!parsed.get("all"))
        // Filter out hidden files
        result = result.filter(file => file[0] !== ".");

    let output = "";

    for (let file of result) {
        let path = `${parsed.get("directory")}/${file}`;
        if (ISDIR(path))
            output += `${make_directory_text(file)} `;
        else
            output += `${file} `;
    }

    print(output, false);
}