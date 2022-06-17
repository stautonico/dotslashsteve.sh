import {print} from "../helpers/io";
import {computer} from "../helpers/globals";

function make_directory_text(directory: string): string {
    return `<span style="color: var(--term-blue)">${directory}</span>`;
}

export function main(args: string[]) {
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