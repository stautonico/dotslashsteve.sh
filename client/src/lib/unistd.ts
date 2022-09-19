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
    let cwd = computer.sys$getcwd();
    if (cwd.fail()) return "?";
    return cwd.get_data()!;
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


export function gethostname(): string {
    let result = computer.sys$gethostname();
    if (result.ok())
        // @ts-ignore: The check above ensures that this is a string
        return result.get_data();
    else
        return "localhost";
}

export function sethostname(name: string): boolean {
    return computer.sys$sethostname(name).ok();
}
