import {FSDirectory} from "./fs.js";

export class Session {
    private real_uid: number;
    private effective_uid: number;
    private saved_uid: number;
    private current_dir: FSDirectory;
    private env: { [key: string]: string } = {"PATH": "/bin:/usr/bin"};

    constructor(real_uid: number, effective_uid: number, saved_uid: number, current_dir: FSDirectory) {
        this.real_uid = real_uid;
        this.effective_uid = effective_uid;
        this.saved_uid = saved_uid;
        this.current_dir = current_dir;
    }

    get_real_uid(): number {
        return this.real_uid;
    }

    get_effective_uid(): number {
        return this.effective_uid;
    }

    get_saved_uid(): number {
        return this.saved_uid;
    }

    get_current_dir(): FSDirectory {
        return this.current_dir;
    }

    set_current_dir(current_dir: FSDirectory): void {
        this.current_dir = current_dir;
    }

    get_env(key: string): string {
        return this.env[key];
    }

    set_env(key: string, value: string): void {
        this.env[key] = value;
    }
}