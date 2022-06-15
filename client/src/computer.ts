import {Directory, StandardFS} from "./fs/inode";
import {User, Group} from "./user";
import {Result, ResultMessages} from "./helpers/result";
import {Session} from "./session";
import {Path} from "./fs/path";

interface NewUserOptions {
    uid?: number;
    full_name?: string;
    room_number?: string;
    work_phone?: string;
    home_phone?: string;
    home_dir?: string;
}

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

        if (!user) return false;
        // Find the user's home directory
        const find_home_dir = this.fs.find(new Path(user.get_home_dir()!));
        if (find_home_dir.fail()) {
            return false;
        } else {
        // @ts-ignore
        this.sessions.push(new Session(uid, uid, uid, find_home_dir.get_data()));
        return true;
        }
    }

    current_session(): Session {
        // This should never fail because we should always have a session
        return this.sessions[this.sessions.length - 1];
    }

    async add_user(username: string, password: string, settings?: NewUserOptions): Promise<Result<User>> {
        if (this.get_user(username))
            return new Result({success:false, message:ResultMessages.ALREADY_EXISTS});

        let next_uid = 0;

        // @ts-ignore
        if (settings !== undefined || settings?.uid !== undefined) {
            // Check if uid is available
            // @ts-ignore
            if (this.users[settings.uid])
                return new Result({success:false, message:ResultMessages.ALREADY_EXISTS});
            // @ts-ignore
            next_uid = settings.uid;
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
            full_name: settings?.full_name,
            room_number: settings?.room_number,
            work_phone: settings?.work_phone,
            home_phone: settings?.home_phone,
            home_dir: settings?.home_dir,
        });


        return new Result({success:true, data:this.users[next_uid]});
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

    find(path: string) {
        return this.fs.find(new Path(path));
    }

    // Syscalls?
    sys$read(filepath: string): Result<string> {
        let path = new Path(filepath).canonicalize();
        let find = this.fs.find(path);

        if (find.fail())
            return new Result({success:false, message:ResultMessages.NOT_FOUND});

        if (find.get_data()!.is_directory())
            return new Result({success:false, message:ResultMessages.IS_DIRECTORY});

        // @ts-ignore: Class inheritance
        return new Result({success:true, data:find.get_data()!.read()});
    }

    sys$write(filepath: string, data: string): Result<void> {
        let path = new Path(filepath).canonicalize();
        let find = this.fs.find(path);

        if (find.fail())
            return new Result({success:false, message:ResultMessages.NOT_FOUND});

        if (find.get_data()!.is_directory())
            return new Result({success:false, message:ResultMessages.IS_DIRECTORY});

        // @ts-ignore: Class inheritance
        return new Result({success:true, data:find.get_data()!.write(data)});
    }

    sys$geteuid(): number {
        return this.current_session().get_effective_uid();
    }

    sys$getegid(): number {
        return this.current_session().get_effective_gid();
    }

    getcwd(): string {
        return this.current_session().get_current_dir().pwd();
    }

    mkdir(path: string) {
        // TODO: Check if the user has permission to create a directory and if the directory already exists
        let path_obj = new Path(path).canonicalize();
        let parent = path_obj.parent_path();
        let parent_exists = this.fs.find(parent);
        if (!parent_exists.ok())
            return new Result({success:false, message:ResultMessages.NOT_FOUND});

        if (parent_exists.get_data()!.is_file())
            return new Result({success:false, message:ResultMessages.IS_FILE});

        // @ts-ignore
        new FSDirectory(path_obj.file_name(), parent_exists.get_data()!, this.geteuid(), this.geteuid());
        return new Result({success:true});
    }
}