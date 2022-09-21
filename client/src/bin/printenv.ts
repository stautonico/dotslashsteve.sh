import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {read} from "../lib/unistd";
import {getallenv} from "../lib/stdlib";

// TODO: Add flags
export const parser = new ArgParser({
    name: "printenv",
    description: "print all or part of environment",
    description_long: "print all or part of environment",
    version: "0.0.1",
    print_function: print,
    args: {}
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    let env = getallenv();

    for (let key in env) {
        print(`${key}=${env[key]}`);
    }

    return 0;
}