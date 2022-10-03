import {computer} from "../util/globals";

export enum open_mode {
    O_RDONLY = 0,
    O_WRONLY = 1,
    O_RDWR = 2,
    O_CREAT = 0x200,
    O_EXCL = 0x800,
    O_NOCTTY = 0x8000,
    O_TRUNC = 0x400,
    O_APPEND = 0x8,
    O_NONBLOCK = 0x80,
    O_DSYNC = 0x1000,
    O_SYNC = 0x4010,
    O_RSYNC = 0x4010,
    O_DIRECTORY = 0x10000,
    O_NOFOLLOW = 0x20000,
    O_CLOEXEC = 0x80000,
    O_DIRECT = 0x100000,
    O_NOATIME = 0x40000,
    O_PATH = 0x1000000,
    O_TMPFILE = 0x2000000,
    O_NDELAY = 0x80,
    O_ACCMODE = 0x3
}

export function read(path: string): string | undefined {
    return computer.sys$read(path).get_data();
}

export function chdir(path: string): boolean {
    return computer.sys$chdir(path).ok();
}

export function getcwd(): string {
    let cwd = computer.sys$getcwd();
    if (cwd.fail()) return "?";
    return cwd.get_data()!;
}

export function geteuid(): number {
    let result = computer.sys$geteuid();
    if (result.ok()) {
        // @ts-ignore: The check above ensures that this is a number
        return result.get_data();
    } // Possible exploit? :)
    else {
        return 0;
    }
}

export function gethostname(): string {
    let result = computer.sys$gethostname();
    if (result.ok()) {
        // @ts-ignore: The check above ensures that this is a string
        return result.get_data();
    } else {
        return "localhost";
    }
}

export function sethostname(name: string): boolean {
    return computer.sys$sethostname(name).ok();
}

export function mkdir(pathname: string, mode: number): boolean {
    return computer.sys$mkdir(pathname, mode).ok();
}

// This only exists for O_CREAT
export function open(pathname: string, flags: number, mode: number): number {
    let result = computer.sys$open(pathname, flags, mode);
    if (result.ok()) {
        // @ts-ignore: The check above ensures that this is a number
        return result.get_data();
    } else {
        return -1;
    }
}
