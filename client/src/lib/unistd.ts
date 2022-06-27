import {computer} from "../helpers/globals";

export function read(path: string): string | undefined {
    return computer.sys$read(path).get_data();
}