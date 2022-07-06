import {print} from "../helpers/io";
import {computer} from "../helpers/globals";
import {ArgParser} from "../helpers/argparser";
import {readdir} from "../lib/dirent";
import {stat, ISDIR} from "../lib/sys/stat";
import {mode_to_string} from "../fs/inode";

function make_directory_text(directory: string): string {
    return `<span style="color: var(--term-blue)">${directory}</span>`;
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

    let dir_exists = stat(parsed.get("directory"));
    if (dir_exists === undefined) {
        print(`ls: ${parsed.get("directory")}: No such file or directory`);
        return;
    }

    let result = readdir(parsed.get("directory"));

    if (result === undefined) {
        print(`ls: ${parsed.get("directory")}: Permission denied`);
        return;
    }

    if (!parsed.get("all"))
        // Filter out hidden files
        result = result.filter(file => file[0] !== ".");

    let output = "";

    for (let file of result) {
        if (parsed.get("long")) {
            let stat_result = stat(`${parsed.get("directory")}/${file}`);
            if (stat_result === undefined)
                continue;
            console.log(stat_result.mode.toString(8));
            output += `${mode_to_string(stat_result.mode)} TODO: Permissions ${stat_result.nlink} TODO: Username TODO: Group name ${stat_result.size} TODO: Process ${stat_result.mtime} ${file}<br />`;
        } else {
            let path = `${parsed.get("directory")}/${file}`;
            if (ISDIR(path))
                output += `${make_directory_text(file)} `;
            else
                output += `${file} `;
        }
    }

    // If we have an extra "<br />" at the end, remove it
    if (output.endsWith("<br />"))
        output = output.slice(0, -6);

    if (output !== "")
        print(output, false);
}