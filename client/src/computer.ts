import {Directory, StandardFS} from "./fs/inode";
import {Group, User} from "./user";
import {Session} from "./session";
import {Errno} from "./util/errno";
import {NewUserOptions} from "./util/computer_helpers";
import {Result, ResultMessages} from "./util/result";
import {sha1hash} from "./util/crypto";
import {Terminal} from "./terminal";
import {print} from "./util/io";
import * as path from "path";

export class Computer {
    private readonly boot_time: number;
    private hostname: string;

    private users: { [uid: number]: User } = {};
    private groups: { [gid: number]: Group } = {};

    private fs: StandardFS = new StandardFS();
    private sessions: Session[] = [];
    private errno: Errno | undefined;

    private shell_history: string[] = [];

    private terminal: Terminal | undefined;

    constructor(hostname: string) {
        this.boot_time = Date.now();
        this.hostname = hostname;
    }

    // This needs to be a separate function for async calls.
    // Without this, the first user could be created with uid 0 because the root
    // user probably wouldn't be created yet
    async init() {
        await this.create_root_user();
    }

    link_terminal(terminal: Terminal) {
        this.terminal = terminal;
    }

    get_boot_time(): number {
        return this.boot_time;
    }

    get_hostname(): string {
        return this.hostname;
    }

    set_hostname(hostname: string) {
        this.hostname = hostname;
        this.sync_hostname_file();
    }

    //////////////////////////
    // User + Group Methods //
    //////////////////////////

    async add_user(
        username: string,
        password: string,
        settings?: NewUserOptions,
    ): Promise<Result<User>> {
        // If the user already exists, return an error.
        if (this.get_user({username})) {
            return new Result({
                success: false,
                message: ResultMessages.ALREADY_EXISTS,
            });
        }

        let next_uid = 0;

        if (settings !== undefined && settings?.uid !== undefined) {
            // Check if uid is available
            if (this.users[settings.uid]) {
                return new Result({
                    success: false,
                    message: ResultMessages.ALREADY_EXISTS,
                });
            }
            next_uid = settings.uid;
        } else {
            // Find the next available uid
            next_uid = 0;

            if (Object.keys(this.users).length === 1) {
                next_uid = 1000;
            } else {
                for (let uid of Object.keys(this.users)) {
                    if (parseInt(uid) > next_uid) {
                        next_uid = parseInt(uid);
                    }
                }
            }
        }

        this.users[next_uid] = new User({
            uid: next_uid,
            username: username,
            password: await sha1hash(password),
            full_name: settings?.full_name,
            room_number: settings?.room_number,
            work_phone: settings?.work_phone,
            home_phone: settings?.home_phone,
            home_dir: settings?.home_dir,
        });

        return new Result({success: true, data: this.users[next_uid]});
    }

    get_user(
        {username, uid}: { username?: string; uid?: number },
    ): User | undefined {
        if (username !== undefined) {
            for (let user of Object.values(this.users)) {
                if (user.get_username() === username) {
                    return user;
                }
            }
        } else if (uid !== undefined) {
            return this.users[uid];
        } else {
            return undefined;
        }
    }

    delete_user(username: string): Result<void> {
        let user = this.get_user({username});

        if (!user) {
            return new Result({success: false, message: ResultMessages.NOT_FOUND});
        }

        delete this.users[user.get_uid()];

        return new Result({success: true});
    }

    get_current_user(): User {
        return this.users[this.current_session().get_effective_uid()];
    }

    async change_user_password(
        uid: number,
        new_password: string,
    ): Promise<Result<void>> {
        let user = this.get_user({uid});

        if (!user) {
            return new Result({success: false, message: ResultMessages.NOT_FOUND});
        }

        await user.set_password(new_password);

        return new Result({success: true});
    }

    change_user_uid(uid: number, new_uid: number): Result<void> {
        let user = this.get_user({uid});

        if (!user) {
            return new Result({success: false, message: ResultMessages.NOT_FOUND});
        }

        if (this.get_user({uid: new_uid})) {
            return new Result({
                success: false,
                message: ResultMessages.ALREADY_EXISTS,
            });
        }

        delete this.users[uid];
        this.users[new_uid] = user;

        return new Result({success: true});
    }

    // TODO: Implement groups

    private async create_root_user() {
        // TODO: Randomize this password for the 'game' element
        await this.add_user("root", "password", {
            uid: 0,
            full_name: "root",
            room_number: "0",
            work_phone: "0",
            home_phone: "0",
            home_dir: "/root",
        });
    }

    // This is in-between a filesystem and a user function
    run_current_user_shellrc() {
        let current_user = this.get_user({uid: this.sys$getuid().get_data()});

        if (!current_user) {
            throw new Error("Failed to find current user when running shellrc");
        }

        let shellrc_location = current_user.get_home_dir() + "/.shellrc";

        let find_shellrc = this.fs.find(shellrc_location);

        if (find_shellrc.ok()) {
            // @ts-ignore
            let shellrc = find_shellrc.get_data() as File;
            // @ts-ignore: read doesn't exist on file??
            let lines = shellrc.read().split("\n");

            for (let line of lines) {
                this.terminal?.handle_command_input(line);
            }
        }
    }

    ////////////////////////
    // Filesystem Methods //
    ////////////////////////

    sync_user_and_group_files() {
        // TODO: Implement
        // Sync the /etc/passwd and /etc/group files with the current users and groups
    }

    sync_hostname_file() {
        // TODO: Implement
        // Sync the /etc/hostname file with the current hostname
    }

    //////////////////
    // Misc Methods //
    //////////////////
    get_env(key: string): string | undefined {
        if (this.sessions.length === 0) {
            return undefined;
        }

        return this.sessions[this.sessions.length - 1].get_env(key);
    }

    set_env(key: string, value: string): Result<void> {
        if (this.sessions.length === 0) {
            // This should never happen, but you never know
            return new Result({success: false});
        }

        this.sessions[this.sessions.length - 1].set_env(key, value);

        return new Result({success: true});
    }

    add_shell_history_record(record: string) {
        this.shell_history.push(record);

        // TODO: Sync with shell history file
    }

    get_shell_history(): string[] {
        return this.shell_history;
    }

    current_session(): Session {
        // This should never fail because we should always have a session
        return this.sessions[this.sessions.length - 1];
    }

    new_session(uid: number): boolean {
        const user = this.get_user({uid});

        if (!user) return false;
        // Find the user's home directory
        const find_home_dir = this.fs.find(user.get_home_dir()!);
        if (find_home_dir.fail()) {
            return false;
        } else {
            // @ts-ignore
            this.sessions.push(
                new Session({real_uid: uid, current_dir: find_home_dir.get_data()! as Directory}),
            );
            return true;
        }
    }

    async run_command(command: string, args: string[]): Promise<number> {
        // Step 1: List all directories in the $PATH
        // Step 2: Loop through each directory and search for our command name
        // Step 3a: If we find it at some point, run the command
        // Step 3b: If we didn't find it, return a "command not found" and exit (127)

        return new Promise<number>(async (resolve) => {
            let path = this.current_session().get_env("PATH");

            if (path === undefined) {
                print(`shell: command not found: ${command}`);
                return resolve(127);
            }

            let bin_dirs = path.split(":");

            for (let dir of bin_dirs) {
                let find_dir = this.fs.find(dir);
                if (find_dir.ok()) {
                    let dir_obj = find_dir.get_data() as Directory;

                    // Try to find our executable inside our directory
                    let has_executable = dir_obj.get_child(command);
                    if (has_executable.ok()) {
                        let module;
                        try {
                            module = await import(`./bin/${command}.js`);
                        } catch (e) {
                            print(
                                "Something went wrong, check the console for more details.",
                            );
                            console.error(e);
                            return resolve(127);
                        }

                        try {
                            return resolve(module.main(args));
                        } catch (e) {
                            // Fake segfault (well, the program did really crash lol)
                            // TODO: Make a fake pid?
                            print(
                                `[1]    <FAKEPID> segmentation fault (core dumped)  ${command}`,
                            );
                            console.error(e);
                            return resolve(139);
                        }
                    }
                }
            }

            // At this point, we are yet to find our executable, so we need to fail
            print(`shell: command not found: ${command}`);
            return resolve(127);
        });
    }

    get_errno(): Errno {
        if (this.errno === undefined) {
            return {name: "", number: 0, message: "No error"};
        }
        return this.errno;
    }

    set_errno(errno: Errno): void {
        this.errno = errno;
    }

    //////////////
    // Syscalls //
    //////////////

    sys$read(path: string): Result<string> {
        let find = this.fs.find(path);

        if (find.fail()) {
            this.errno = Errno.ENOENT;
            return new Result({success: false, message: ResultMessages.NOT_FOUND});
        }

        if (find.get_data() instanceof Directory) {
            this.errno = Errno.EISDIR;
            return new Result({
                success: false,
                message: ResultMessages.IS_DIRECTORY,
            });
        }

        // @ts-ignore
        return (find.get_data() as File).read();
    }

    sys$getuid(): Result<number> {
        if (this.sessions.length === 0) {
            return new Result({success: false, message: ResultMessages.GENERIC});
        }

        return new Result({
            success: true,
            data: this.sessions[this.sessions.length - 1].get_saved_uid(),
        });
    }

    sys$geteuid(): Result<number> {
        if (this.sessions.length === 0) {
            return new Result({success: false, message: ResultMessages.GENERIC});
        }

        return new Result({
            success: true,
            data: this.sessions[this.sessions.length - 1].get_saved_uid(),
        });
    }

    sys$getcwd(): Result<string> {
        if (this.sessions.length === 0) {
            return new Result({success: false, message: ResultMessages.GENERIC});
        }

        return new Result({
            success: true,
            data: this.sessions[this.sessions.length - 1].get_current_dir().pwd(),
        });
    }

    sys$gethostname() {
        return new Result({success: true, data: this.hostname});
    }

    sys$sethostname(hostname: string) {
        // Only root can change the hostname
        if (this.sys$geteuid().get_data() !== 0) {
            this.errno = Errno.EPERM;
            return new Result({success: false, message: ResultMessages.NOT_ALLOWED});
        }

        this.hostname = hostname;
        this.sync_hostname_file();

        return new Result({success: true});
    }

    sys$readdir(path: string): Result<string[]> {
        let find = this.fs.find(path);

        if (find.fail()) {
            this.errno = Errno.ENOENT;
            return new Result({success: false, message: ResultMessages.NOT_FOUND});
        }

        if (find.get_data() instanceof File) {
            this.errno = Errno.ENOTDIR;
            return new Result({success: false, message: ResultMessages.IS_FILE});
        }

        let children = (find.get_data() as Directory).get_children();

        let children_names: string[] = [];

        for (let child of children) {
            children_names.push(child.get_name());
        }

        return new Result({success: true, data: children_names});
    }

    sys$mkdir(pathname: string, mode: number): Result<void> {
        // Check if it already exists
        let find_dir = this.fs.find(pathname);

        if (find_dir.ok()) {
            this.errno = Errno.EEXIST;
            return new Result({success: false, message: ResultMessages.ALREADY_EXISTS});
        }

        if (!pathname.includes("/")) pathname = "./" + pathname;

        // Make sure we have write permissions on the parent dir
        let parent_path = pathname.split("/").slice(0, -1).join("/");

        // Just in case
        let find_parent = this.fs.find(parent_path);

        if (find_parent.fail()){
            this.errno = Errno.ENOENT;
            return new Result({success: false, message: ResultMessages.NOT_FOUND});
        }

        // TODO: Check write permissions on parent

        // TODO: Replace this with this.sys$getegid()
        // TODO: Apply `mode`
        // @ts-ignore
        let new_dir = new Directory(pathname.split("/").at(-1), this.sys$geteuid(), this.sys$geteuid(), {
            parent: find_parent.get_data()
        });

        return new Result({success: true});
    }
}
