import {print}  from "../helpers/io";
import {ArgParser} from "../helpers/argparser";

export function main(args: string[]) {
    let parser = new ArgParser({
        name: "uname",
        description: "print system information",
        description_long: "Print certain system information.  With no OPTION, same as -s.",
        version: "0.0.1",
        print_function: print,
        args: {
            "all": {
                description: "print all information, in the following order, except omit -p and -i if unknown:",
                long: "all",
                short: "a",
                type: "boolean"
            },
            "kernel-name": {
                description: "print the kernel name",
                long: "kernel-name",
                short: "s",
                type: "boolean"
            },
            "nodename": {
                description: "print the network node hostname",
                long: "nodename",
                short: "n",
                type: "boolean"
            },
            "kernel-release": {
                description: "print the kernel release",
                long: "kernel-release",
                short: "v",
                type: "boolean"
            },
            "kernel-version": {
                description: "print the kernel version",
                long: "kernel-version",
                short: "r",
                type: "boolean"
            },
            "machine": {
                description: "print the machine hardware name",
                long: "machine",
                short: "m",
                type: "boolean"
            },
            "processor": {
                description: "print the processor type",
                long: "processor",
                short: "p",
                type: "boolean"
            },
            "hardware-platform": {
                description: "print the hardware platform",
                long: "hardware-platform",
                short: "i",
                type: "boolean"
            },
            "operating-system": {
                description: "print the operating system name",
                long: "operating-system",
                short: "o",
                type: "boolean"
            }
        }
    });
    console.log(parser.parse(args));
}
