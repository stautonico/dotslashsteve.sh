import {computer} from "../helpers/globals";

export function readdir(path: string): string[] | undefined {
    // Not exactly the same as real readdir, but easier to implement (and convenient)
    return computer.sys$readdir(path).get_data();
}