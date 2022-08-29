import {Directory} from "./fs/inode";

export class Session {
    private readonly real_uid: number;
    private readonly real_gid: number;
    private effective_uid: number;
    private effective_gid: number;
    private readonly saved_uid: number;
    private readonly saved_gid: number;
    private current_dir: Directory;
    private env: { [key: string]: string } = {"PATH": "/bin:/usr/bin"};

    constructor(real_uid: number, effective_uid: number, saved_uid: number, current_dir: Directory) {
        this.real_uid = real_uid;
        this.effective_uid = effective_uid;
        this.saved_uid = saved_uid;
        this.current_dir = current_dir;

        // TODO: Make this use named parameters
        this.real_gid = real_uid;
        this.effective_gid = effective_uid;
        this.saved_gid = saved_uid;
    }

    get_real_uid(): number {
        return this.real_uid;
    }

    get_real_gid(): number {
        return this.real_gid;
    }

    get_effective_uid(): number {
        return this.effective_uid;
    }

    get_effective_gid(): number {
        return this.effective_gid;
    }

    set_effective_uid(effective_uid: number): void {
        this.effective_uid = effective_uid;
    }

    set_effective_gid(effective_gid: number): void {
        this.effective_gid = effective_gid;
    }

    get_saved_uid(): number {
        return this.saved_uid;
    }

    get_current_dir(): Directory {
        return this.current_dir;
    }

    set_current_dir(current_dir: Directory): void {
        this.current_dir = current_dir;
    }

    get_env(key: string): string {
        return this.env[key];
    }

    set_env(key: string, value: string): void {
        this.env[key] = value;
    }
}