import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {read} from "../lib/unistd";
import {listenv} from "../lib/stdlib";

// TODO: Support cat-ing multiple files
export const parser = new ArgParser({
    name: "printenv",
    description: "Print the variables of the specified environment VARIABLE(s)",
    description_long: "Print the variables of the specified environment VARIABLE(s)\nIf no VARIABLE is specified, print name and value pairs for them all.",
    version: "1.0.0",
    print_function: print,
    args: {}
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    const vars = listenv();

    for (let key in vars) {
        print(`${key}=${vars[key]}`);
    }

    return 0;
}
