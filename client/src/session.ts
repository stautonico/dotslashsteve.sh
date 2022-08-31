import {Directory} from "./fs/inode";
import {computer} from "./helpers/globals";

interface SessionArguments {
    real_uid: number,
    effective_uid?: number, // Default - real uid
    saved_uid?: number, // Default - real uid

    real_gid?: number, // Default - real uid
    effective_gid?: number, // Default - real gid
    saved_gid?: number, // Default - real gid

    current_dir?: Directory // Default - ~ (User's home directory, or worst case: '/')
}

export class Session {
    private readonly real_uid: number;
    private readonly real_gid: number;
    private effective_uid: number;
    private effective_gid: number;
    private readonly saved_uid: number;
    private readonly saved_gid: number;
    private current_dir: Directory;
    private env: { [key: string]: string } = {"PATH": "/bin:/usr/bin"};

    constructor(args: SessionArguments) {
        this.real_uid = args.real_uid;
        this.effective_uid = args.effective_uid || args.real_uid;
        this.saved_uid = args.saved_uid || args.real_uid;
        // @ts-ignore
        this.current_dir = args.current_dir || computer.find("/").get_data(); // TODO: Set default if not provided

        this.real_gid = args.real_gid || this.real_uid;
        this.effective_gid = args.effective_uid || this.real_gid;
        this.saved_gid = args.saved_gid || this.real_gid;
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