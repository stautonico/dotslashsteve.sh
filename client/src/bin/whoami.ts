import {print} from "../util/io";
import {geteuid} from "../lib/unistd";
import {ArgParser} from "../util/argparser";
import {getpwuid} from "../lib/pwd";

export const parser = new ArgParser({
    name: "whoami",
    description: "print effective user name",
    description_long: "Print the user name associated with the current effective user ID.  Same as id -un.",
    version: "1.0.0",
    print_function: print
});

export function main(args: string[]): number {
    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;


    let passwd = getpwuid(geteuid());

    if (passwd === undefined) {
        print(`whoami: cannot find username for UID ${geteuid()}`);
        return 1;
    }

    print(passwd.pw_name);

    return 0;
}
