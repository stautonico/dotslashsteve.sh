import {Result, ResultMessages} from "./helpers/result.js";
import {
    PROC_DIR_PERMISSIONS,
    ROOT_DIR_PERMISSIONS,
    SYS_DIR_PERMISSIONS,
    TMP_DIR_PERMISSIONS
} from "./helpers/constants.js";

interface Permission {
    read: boolean;
    write: boolean;
    execute: boolean;
}

export interface InodePermissions {
    owner: Permission;
    group: Permission;
    other: Permission;
}

// Default file permissions is rw-r--r-- (644)
const DEFAULT_FILE_PERMISSIONS: InodePermissions = {
    owner: {
        read: true,
        write: true,
        execute: false
    },
    group: {
        read: true,
        write: false,
        execute: false
    },
    other: {
        read: true,
        write: false,
        execute: false
    }
}

// Default directory permissions is rwxr-xr-x (755)
const DEFAULT_DIR_PERMISSIONS: InodePermissions = {
    owner: {
        read: true,
        write: true,
        execute: true
    },
    group: {
        read: true,
        write: false,
        execute: false
    },
    other: {
        read: true,
        write: false,
        execute: true
    }
}

class FSBaseObject {
    protected name: string;
    protected parent: FSDirectory | null;
    protected owner: number;
    protected group_owner: number;
    protected size: number = 0;
    // Use date object for simplicity
    protected atime: Date = new Date(); // Access time
    protected mtime: Date = new Date(); // Modify time (content change)
    protected ctime: Date = new Date(); // Change time (metadata change/perms etc)
    // TODO: Event listeners

    // Default permissions is rw-r--r-- (0644)
    private permissions: InodePermissions = DEFAULT_FILE_PERMISSIONS;

    constructor(public _name: string, parent: FSDirectory | null, owner: number, group_owner: number) {
        this.name = _name;
        this.parent = parent;
        this.owner = owner;
        this.group_owner = group_owner;
    }

    is_file(): boolean {
        return false;
    }

    is_directory(): boolean {
        return false;
    }

    get_name(): string {
        return this.name;
    }

    calculate_size(): number {
        // This will never get used, just so TS doesn't complain
        return this.size;
    }

    set_permissions(permissions: InodePermissions): void {
        this.permissions = permissions;
    }

    pwd(): string {
        if (this.parent === null)
            return "/";
        return this.parent.pwd() + "/" + this.name;
    }
}

export class FSFile extends FSBaseObject {
    private content: string = "";

    constructor(_name: string, parent: FSDirectory | null, owner: number, group_owner: number) {
        super(_name, parent, owner, group_owner);

        this.size = this.content.length + this.name.length;

        if (parent) {
            if (parent.is_directory())
                parent.add_child(this);
            else
                throw new Error(`${this.name}'s parent is not a directory (${parent.get_name()})`);
        }
    }

    calculate_size(): number {
        this.size = this.content.length + this.name.length;
        return this.size;
    }

    is_file(): boolean {
        return true;
    }
}

export class FSDirectory extends FSBaseObject {
    private children: { [name: string]: FSBaseObject } = {};

    constructor(_name: string, parent: FSDirectory | null, owner: number, group_owner: number) {
        super(_name, parent, owner, group_owner);

        if (parent) {
            if (parent.is_directory())
                parent.add_child(this);
            else
                throw new Error(`${this.name}'s parent is not a directory (${parent.get_name()})`);
        }
        this.update_size();
    }

    is_directory(): boolean {
        return true;
    }

    add_child(child: FSBaseObject): Result<void> {
        if (this.children[child.get_name()])
            return new Result(false, ResultMessages.ALREADY_EXISTS);

        this.children[child.get_name()] = child;
        this.update_size();

        // TODO: self.handle_event(write)?

        return new Result(true);
    }

    calculate_size(): number {
        let total = 0;

        for (let child in this.children) {
            total += this.children[child].calculate_size();
        }

        return total;
    }

    update_size(): void {
        this.size = this.calculate_size();

        if (this.parent)
            this.parent.update_size();
    }
}

export class StandardFS {
    private root: FSDirectory = new FSDirectory("/", null, 0, 0);

    constructor() {
        this.init();
    }

    init(): void {
        for (let dir of ["bin", "etc", "home", "lib", "mnt", "opt", "proc", "root", "sbin", "tmp", "usr", "var"]) {
            let directory = new FSDirectory(dir, this.root, 0, 0);

            if (dir === "proc") {
                directory.set_permissions(PROC_DIR_PERMISSIONS);
            } else if (dir === "root") {
                directory.set_permissions(ROOT_DIR_PERMISSIONS);
            } else if (dir === "sys") {
                directory.set_permissions(SYS_DIR_PERMISSIONS);
            } else if (dir === "tmp") {
                directory.set_permissions(TMP_DIR_PERMISSIONS);
            }
            // Otherwise, the default permissions are fine (rwxr-xr-x)
        }

        // Setup the individual directories in the root directory
        //this.setup_bin();
        //this.setup_etc();
        //this.setup_home();
        //this.setup_lib();
        //this.setup_mnt();
        //this.setup_opt();
        //this.setup_proc();
        //this.setup_root();
        //this.setup_sbin();
        //this.setup_tmp();
        //this.setup_usr();
        //this.setup_var();

    }

    find(path: string): Result<FSBaseObject | undefined> {
        // let parts = path.split("/");
        // let current = this.root;
        //
        // for (let i = 0; i < parts.length; i++) {
        //     if (parts[i] === "")
        //         continue;
        //
        //     if (!current.children[parts[i]])
        //         return new Result(false, ResultMessages.NOT_FOUND);
        //
        //     current = current.children[parts[i]];
        // }

        // return new Result(true, ResultMessages.SUCCESS, current);
        return new Result(false);
    }

    get_root(): FSDirectory {
        return this.root;
    }
}
