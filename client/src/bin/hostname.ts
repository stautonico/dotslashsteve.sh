import {ArgParser} from "../util/argparser";
import {perror, print} from "../util/io";
import {gethostname, sethostname} from "../lib/unistd";

export const parser = new ArgParser({
    name: "hostname",
    description: "show or set system host name",
    description_long: "Show or set the system's host name.",
    version: "0.0.1",
    print_function: print,
    args: {
        "name": {
            description: "the new name for the host",
            type: "string",
            required: false,
            positional: true
        }
    }
});

export function main(args: string[]): number {
    // TODO: Implement some of the flags (-d, -s, etc)
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    // If we have no arguments, print the hostname
    if (parsed.has("name")) {
        let result = sethostname(parsed.get("name"));

        if (!result) {
            perror("hostname: Failed to set hostname");
            return 1;
        }
        return 0;
    }


    print(gethostname());

    return 0;
}
