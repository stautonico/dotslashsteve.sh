import {print, debug} from "../helpers/io";
import {read} from "../lib/unistd";
import {ArgParser} from "../helpers/argparser";
import {stat} from "../lib/sys/stat";

export function main(args: string[]) {
    let parser = new ArgParser({
        name: "cat",
        description: "concatenate files and print on the standard output",
        description_long: "concatenate files and print on the standard output",
        version: "0.0.1",
        print_function: print,
        args: {
            "file": {
                description: "the file to print",
                type: "string",
                required: true
            }
        }
    });
    let parsed = parser.parse(args);

    if (parsed.printed_version_or_help())
        return;

    const ascii = [
        '                        ',
        '   o@@@@@@@@@O.         ',
        ' o@@@@@@@@@@@@.         ',
        ' @@@@@@*°*o#@*          ',
        ' @@@@@@#*.              ',
        ' O@@@@@@@@@@@°          ',
        '   O@@@@@@@@@@@         ',
        '       .*@@@@@@°        ',
        '  @@#O***@@@@@@.        ',
        ' @@@@@@@@@@@@@o         ',
        ' o#@@@@@@@@@o           ',
        '                        ',
        '                        '];

    const make_colored_block = (color: string) => {
        return `<span style="color: var(--term-${color})">██</span>`;
    };

    let colored_blocks: string[][] = [[], []];

    for (let color of ["black", "red", "green", "yellow", "blue", "purple", "cyan", "white"])
        colored_blocks[0].push(make_colored_block(color));

    for (let color of ["light-black", "light-red", "light-green", "light-yellow", "light-blue", "light-purple", "light-cyan", "light-white"])
        colored_blocks[1].push(make_colored_block(color));

    const info_lines = {
        1: `[username]@[hostname]`,
        2: ``,
        3: `OS: [OS]`,
        4: `Kernel: [Kernel]`,
        5: `Uptime: [Uptime]`,
        6: `Shell: [Shell]`, // Possible names: 'Trout' (play on 'Fish'), 'Bish' (play on 'Bash')
        7: `Resolution: [Resolution]`,
        8: `Terminal: [Terminal]`, // 'Puppy' (play on 'Kitty')
        9: `CPU: [CPU]`,
        10: `GPU: [GPU]`,
        11: `Memory: [Memory]`,
        12: `${colored_blocks[0].join("")}`,
        13: `${colored_blocks[1].join("")}`,
    }

    // We have to do this after info_lines is defined
    info_lines[2] = `${'-'.repeat(info_lines[1].length)}`;


    for (let i = 0; i < ascii.length; i++) {
        print(ascii[i], {font: "Liberation Mono", newline: false});
        // @ts-ignore: Its hard coded, it'll be fine
        print(info_lines[i + 1], {sanitize_html: false});
    }
}
