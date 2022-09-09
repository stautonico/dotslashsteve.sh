import {print}  from "../util/io";
import {computer} from "../util/globals";

export function main(args: string[]): number {
    // TODO: Build using "syscalls"
    let result = computer.mkdir(args[0]);
    // TODO: Make this properly handle errors
    print(result.ok() ? "Success" : "Failure");

    return 0;
}
