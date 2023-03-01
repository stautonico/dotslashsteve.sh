import {print} from "../util/io";
import {ArgParser} from "../util/argparser";

export const parser = new ArgParser({
    name: "reboot",
    description: "Reboot the system",
    description_long: "halt, poweroff, reboot - Halt, power-off or reboot the machine",
    version: "0.0.1",
    print_function: print,
    args: {} // TODO: Add arguments
});

export function main(args: string[]): number {
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;

    // Refresh the page
    window.location.reload();

    return 0;
}
