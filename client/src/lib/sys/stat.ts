import {computer} from "../../helpers/globals";

export interface StatStruct {
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    atime: number;
    mtime: number;
    ctime: number;
    crtime: number;
}

export function stat(path: string): StatStruct | undefined {
    return computer.sys$stat(path).get_data();
}

export function ISDIR(path: string): boolean {
    let find_result = computer.find(path);

    if (find_result.fail())
        return false;

    return find_result.get_data()!.is_directory();
}

export function ISREG(path: string): boolean {
    let find_result = computer.find(path);

    if (find_result.fail())
        return false;

    return find_result.get_data()!.is_file();
}