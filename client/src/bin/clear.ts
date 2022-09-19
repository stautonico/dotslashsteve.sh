import {ArgParser} from "../util/argparser";
import {print} from "../util/io";
import {OUTPUT_BUFFER} from "../util/globals";

export const parser = new ArgParser({
    name: "clear",
    description: "clear the terminal screen",
    description_long: "clear the terminal screen",
    version: "0.0.1",
    print_function: print,
});

export function main(args: string[]): number {
    // TODO: Implement clear -x (clear but keep scrollback)
    const parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return 0;


    OUTPUT_BUFFER.clear();

    return 0;
}
