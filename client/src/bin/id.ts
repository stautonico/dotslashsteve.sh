import {perror, print,} from "../util/io";
import {computer} from "../util/globals";
import {ArgParser} from "../util/argparser";
import {Errno} from "../util/errno";
import {geteuid} from "../lib/unistd";

export const parser = new ArgParser({
    name: "id",
    description: "print real and effective user and group IDs",
    description_long: "Print user and group information for each specified USER, or (when USER omitted) for the current user.",
    version: "1.0",
    print_function: print,
    args: {
        "user": {
            description: "the user to print information about",
            type: "string",
            required: false,
            positional: true
        }
        // TODO: Add flags
    }
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    if (parsed.has("user")) {
        computer.set_errno(Errno.ENOSYS);
        perror("id");
        return 1;
    }

    let uid = geteuid();

    print(`${uid}`);

    return 0;
}
