import {StandardFS} from "./fs.js";
import {User, Group} from "./user.js";
import {Result, ResultMessages} from "./helpers/result.js";
import {Session} from "./session.js";

export class Computer {
    public boot_time: number;
    private hostname: string;
    private users: { [uid: number]: User } = {};
    private groups: { [gid: number]: Group } = {};
    private fs: StandardFS = new StandardFS();
    private sessions: Session[] = [];

    constructor(hostname: string) {
        this.boot_time = Date.now();
        this.hostname = hostname;

        this.users[0] = new User({
            uid: 0,
            username: "root",
            password: "",
        });
    }


    new_session(uid: number): boolean {
        const user = this.get_user_by_uid(uid);
        if (user) {

        } else {
            return false;
        }
        // Find the user's home directory
        // const find_home_dir = this.fs.find(user.get_home_dir()!);
        // if (find_home_dir.fail()) {
        //     return false;
        // } else {
        // @ts-ignore
        // this.sessions.push(new Session(uid, uid, uid, find_home_dir.get_data()));
        this.sessions.push(new Session(uid, uid, uid, this.fs.get_root()));
        return true;
        // }
    }

    current_session(): Session {
        // This should never fail because we should always have a session
        return this.sessions[this.sessions.length - 1];
    }

    async add_user(username: string, password: string, uid?: number): Promise<Result<User>> {
        if (this.get_user(username))
            return new Result(false, ResultMessages.ALREADY_EXISTS);

        let next_uid = 0;

        if (uid !== undefined) {
            // Check if uid is available
            if (this.users[uid])
                return new Result(false, ResultMessages.ALREADY_EXISTS);
            next_uid = uid;
        } else {
            // Find the next available uid
            next_uid = 0;

            if (Object.keys(this.users).length === 1) {
                next_uid = 1000;
            } else {
                for (let uid of Object.keys(this.users)) {
                    if (parseInt(uid) > next_uid)
                        next_uid = parseInt(uid);
                }
            }
        }

        // SHA-1 hash the password
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-1', data);
        const decoder = new TextDecoder();

        this.users[next_uid] = new User({
            uid: next_uid,
            username: username,
            password: decoder.decode(hash),
        });


        return new Result(true, ResultMessages.SUCCESS, this.users[next_uid]);
    }

    get_user(username: string): User | null {
        for (let uid in this.users) {
            if (this.users[uid].get_username() === username)
                return this.users[uid];
        }

        return null;
    }

    get_user_by_uid(uid: number): User | null {
        if (this.users[uid])
            return this.users[uid];
        else
            return null;
    }

    get_hostname(): string {
        return this.hostname;
    }

    get_current_user(): User {
        return this.users[this.current_session().get_effective_uid()];
    }

    // Syscalls?
    geteuid(): number {
        return this.current_session().get_effective_uid();
    }
}