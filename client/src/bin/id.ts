import {print,} from "../util/io";
import {computer} from "../util/globals";
import {ArgParser} from "../util/argparser";

export function main(_args: string[]): number {
    let parser = new ArgParser({
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


    return 0;
}
