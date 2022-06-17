import {print} from "../helpers/io";
import {computer} from "../helpers/globals";


export function main(args: string[]) {
    // TODO: Build using "syscalls"
    if (args.length < 1) {
        print(`usage: cat [file]`, true);
        return;
    }

    const file = args[0];
    const find_file = computer.find(file);
    if (find_file.fail()) {
        print(`${file}: No such file or directory (os error 2)`);
        return;
    }

    // @ts-ignore
    let data = find_file.get_data()!.read().get_data();

    data = data.replaceAll("\n", "<br />");
    data = data.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
    data = data.replaceAll(" ", "&nbsp;");

    print(data);

}