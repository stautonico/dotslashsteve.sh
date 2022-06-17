import {print}  from "../helpers/io";
import {computer} from "../helpers/globals";

export function main(args: string[]) {
    print(`uptime: ${(Date.now() - computer.boot_time) / 1000} seconds`, true);
}