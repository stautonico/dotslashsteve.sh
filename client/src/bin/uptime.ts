import {print}  from "../helpers/io";
import {computer} from "../helpers/globals";

export function main(_args: string[]) {
    print(`uptime: ${(Date.now() - computer.boot_time) / 1000} seconds`);
}