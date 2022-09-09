import {computer} from "../util/globals";

export function read(path: string): string | undefined {
    return computer.sys$read(path).get_data();
}

export function chdir(path: string): boolean {
    console.log(`Chdiring to ${path}`);
    return computer.sys$chdir(path).ok();
}

export function getcwd(): string {
    return computer.getcwd();
}