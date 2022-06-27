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
}

export function stat(path: string): StatStruct | undefined {
    return computer.sys$stat(path).get_data();
}