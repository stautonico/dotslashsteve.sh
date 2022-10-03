import {perror, print,} from "../util/io";
import {computer} from "../util/globals";
import {ArgParser} from "../util/argparser";
import {Errno} from "../util/errno";
import {geteuid} from "../lib/unistd";
import {getpwnam, getpwuid} from "../lib/pwd";

// TODO: Implement in a not shit way
export const parser = new ArgParser({
    name: "id",
    description: "print real and effective user and group IDs",
    description_long: "Print user and group information for each specified USER, or (when USER omitted) for the current user.",
    version: "0.0.1",
    print_function: print,
    args: {
        "user": {
            description: "the user to print information about",
            type: "string",
            required: false,
            positional: true
        },
        "lowercase_a": {
            description: "ignore, for compatibility with other versions",
            short: "a",
            type: "boolean"
        },
        "context": {
            description: "print only the security context of the process",
            short: "Z",
            long: "context",
            type: "boolean"
        },
        "group": {
            description: "print only the effective group ID",
            short: "g",
            long: "group",
            type: "boolean"
        },
        "groups": {
            description: "print all group IDs",
            short: "G",
            long: "groups",
            type: "boolean"
        },
        "name": {
            description: "print a name instead of a number, for -ugG",
            short: "n",
            long: "name",
            type: "boolean"
        },
        "real": {
            description: "print the real ID instead of the effective ID, with -ugG",
            short: "r",
            long: "real",
            type: "boolean"
        },
        "user_flag": {
            description: "print only the effective user ID",
            short: "u",
            long: "user",
            type: "boolean"
        },
        "zero": {
            description: "end each output line with NUL, not whitespace",
            short: "z",
            long: "zero",
            type: "boolean"
        }
    }
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    // Make sure we don't have any more than one exclusive argument
    let exclusive_args = ["user_flag", "group", "groups"];
    let exclusive_args_used = exclusive_args.filter(arg => parsed.get(arg));
    if (exclusive_args_used.length > 1) {
        print("id: cannot print \"only\" of more than one choice");
        return 1;
    }


    if (parsed.get("context")) {
        print("id: --context (-Z) works only on an SELinux-enabled kernel");
        return 1;
    }

    if (parsed.get("group")) {
        // TODO: Implement groups
        computer.set_errno(Errno.ENOSYS);
        perror("id: --group (-g)");
        return 1;
    }

    // TODO: Make this not horrible
    if (parsed.get("user_flag")) {
        if (parsed.get("name")) {
            print(computer.get_user({uid: geteuid()})?.get_username());
        } else {
            print(`${geteuid()}`);
        }
        return 0;
    }

    let uid;

    if (parsed.has("user")) {
        let entry = getpwnam(parsed.get("user"));
        if (!entry) {
            print(`id: '${parsed.get("user")}': no such user`);
            return 1;
        }
        uid = entry?.pw_uid;
    } else {
        uid = geteuid();
    }

    let output = "";


    output += `uid=${uid}`

    let user = getpwuid(uid);

    if (user) {
        output += `(${user.pw_name})`;
    }

    //TODO: Get gid
    output += ` gid=${uid}`;

    if (user) {
        output += `(${user.pw_name})`;
    }

    print(output);

    return 0;
}
