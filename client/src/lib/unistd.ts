import {computer} from "../util/globals";

export function read(path: string): string | undefined {
    return computer.sys$read(path).get_data();
}

export function chdir(path: string): boolean {
    // TODO: Implement
    return false;
    // return computer.sys$chdir(path).ok();
}

export function getcwd(): string {
    return "";
    // TODO: Implement
    // return computer.sys$getcwd();
}

export function geteuid(): number {
    let result = computer.sys$geteuid();
    if (result.ok())
        // @ts-ignore: The check above ensures that this is a number
        return result.get_data();
    else
        // Possible exploit? :)
        return 0;
}
