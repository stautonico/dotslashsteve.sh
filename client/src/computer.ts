import {Directory, StandardFS} from "./fs/inode";
import {User, Group} from "./user";
import {Result, ResultMessages} from "./helpers/result";
import {Session} from "./session";
import {Path} from "./fs/path";
import {sha1hash} from "./helpers/crypto";
import {StatStruct} from "./lib/sys/stat";
import {print} from "./helpers/io";


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
    private input_history: string[] = [];

    // TODO: Sync input history to 'disk'

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
        const find_home_dir = this.fs.find(user.get_home_dir()!);
        if (find_home_dir.fail()) {
            return false;
        } else {
            // @ts-ignore
            this.sessions.push(new Session({real_uid: uid, current_dir: find_home_dir.get_data()}));
            return true;
        }
    }

    current_session(): Session {
        // This should never fail because we should always have a session
        return this.sessions[this.sessions.length - 1];
    }

    async add_user(username: string, password: string, settings?: NewUserOptions): Promise<Result<User>> {
        if (this.get_user(username))
            return new Result({success: false, message: ResultMessages.ALREADY_EXISTS});

        let next_uid = 0;

        // @ts-ignore
        if (settings !== undefined && settings?.uid !== undefined) {
            // Check if uid is available
            // @ts-ignore
            if (this.users[settings.uid])
                return new Result({success: false, message: ResultMessages.ALREADY_EXISTS});
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
        return this.fs.find(path);
    }

    get_input_history(index?: number): string | string[] {
        if (index === undefined)
            // Get the entire input history if no index is provided
            return this.input_history;
        // The index is in reverse order
        return [...this.input_history].reverse()[index];
    }

    add_input_record(input: string) {
        this.input_history.push(input);
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
                let find_dir = this.find(dir);
                if (find_dir.ok()) {
                    let dir_obj = find_dir.get_data() as Directory;

                    // Try to find our executable inside our directory
                    let has_executable = dir_obj.get_child(command);
                    if (has_executable.ok()) {
                        let module;
                        try {
                            module = await import(`./bin/${command}.js`);
                        } catch (e) {
                            print("Something went wrong, check the console for more details.");
                            console.error(e);
                            return resolve(127);
                        }

                        try {
                            return resolve(module.main(args));
                        } catch (e) {
                            // Fake segfault (well, the program did really crash lol)
                            print(`[1]    <FAKEPID> segmentation fault (core dumped)  ${command}`);
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

    // Syscalls?
    sys$read(filepath: string): Result<string> {
        let find = this.fs.find(filepath);

        if (find.fail())
            return new Result({success: false, message: ResultMessages.NOT_FOUND});

        if (find.get_data()!.is_directory())
            return new Result({success: false, message: ResultMessages.IS_DIRECTORY});

        // @ts-ignore: Class inheritance
        return find.get_data()!.read();
    }

    sys$write(filepath: string, data: string): Result<void> {
        let find = this.fs.find(filepath);

        if (find.fail())
            return new Result({success: false, message: ResultMessages.NOT_FOUND});

        if (find.get_data()!.is_directory())
            return new Result({success: false, message: ResultMessages.IS_DIRECTORY});

        // @ts-ignore: Class inheritance
        return new Result({success: true, data: find.get_data()!.write(data)});
    }

    sys$geteuid(): number {
        return this.current_session().get_effective_uid();
    }

    sys$getegid(): number {
        return this.current_session().get_effective_gid();
    }

    sys$stat(filepath: string): Result<StatStruct> {
        let find = this.fs.find(filepath);

        if (find.fail())
            return new Result({success: false, message: ResultMessages.NOT_FOUND});

        return new Result({success: true, data: find.get_data()!.stat()});
    }

    sys$readdir(filepath: string): Result<string[]> {
        let find = this.fs.find(filepath);

        if (find.fail())
            return new Result({success: false, message: ResultMessages.NOT_FOUND});

        if (!find.get_data()!.is_directory())
            return new Result({success: false, message: ResultMessages.IS_FILE});

        let files = [];

        // @ts-ignore: Class inheritance
        for (let file of find.get_data()!.get_children()) {
            files.push(file.get_name());
        }

        return new Result({success: true, data: files});
    }

    sys$chdir(filepath: string): Result<void> {
        let find = this.fs.find(filepath);

        if (find.fail())
            return new Result({success: false, message: ResultMessages.NOT_FOUND});

        if (!find.get_data()!.is_directory())
            return new Result({success: false, message: ResultMessages.IS_FILE});

        // @ts-ignore: Class inheritance
        this.current_session().set_current_dir(find.get_data());

        return new Result({success: true});
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
            return new Result({success: false, message: ResultMessages.NOT_FOUND});

        if (parent_exists.get_data()!.is_file())
            return new Result({success: false, message: ResultMessages.IS_FILE});

        // @ts-ignore
        new Directory(path_obj.file_name(), parent_exists.get_data()!, this.geteuid(), this.geteuid());
        return new Result({success: true});
    }
}

/*
Possible commands to implement:
adduser - 100%
base32
base64
cat - 100%
cd - 100%
chmod - 100%
chown - 100%
clear - 100%
commands ?
cp - 100%
date
echo - 100%
env - 100%
exit - 100%
export - 100%
head
hostname - 100%
id - 100%
ls - 100%
man
md5sum
mkdir - 100%
mv - 100%
nano
passwd - 100%
poweroff
printenv - 100%
pwd - 100%
reboot
rmdir - 100%
rm - 100%
sha1sum
sha224sum
sha256sum
sha384sum
sha512sum
stat - 100%
sudo
su - 100%
tail
touch - 100%
tutorial
uname (DONE)
unset - 100%
uptime - 100%
users
wc
which
whoami - 100%
who
 */