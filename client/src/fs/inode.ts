import {Result, ResultMessages} from "../helpers/result.js";
import {
    PROC_DIR_PERMISSIONS,
    ROOT_DIR_PERMISSIONS,
    SYS_DIR_PERMISSIONS,
    TMP_DIR_PERMISSIONS
} from "../helpers/constants.js";
import {Path} from "./path.js";
import {computer} from "../helpers/globals.js";

type PermissionType = "read" | "write" | "execute";
type EventType = "read" | "write" | "execute" | "move" | "change_perm" | "change_owner" | "delete";

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

interface FSBaseObjectOtherOptions {
    permissions?: InodePermissions;
    setuid?: boolean;
    parent?: FSBaseObject;
}

interface FileOtherOptions extends FSBaseObjectOtherOptions {
    content?: string;
}

class FSBaseObject {
    protected name: string;
    protected permissions: InodePermissions;
    protected setuid: boolean; // Maybe unused, we'll see
    protected parent?: Directory;
    protected owner: number;
    protected group_owner: number;
    // TODO: Link count?
    protected size: number = 0;
    protected atime: Date = new Date(); // Access time
    protected mtime: Date = new Date(); // Modify time (content change)
    protected ctime: Date = new Date(); // Change time (metadata change/perms etc)
    protected crtime: Date = new Date(); // Creation time (file creation)
    // TODO: Events

    constructor(name: string, owner: number, group_owner: number, other?: FSBaseObjectOtherOptions) {
        this.name = name;
        this.owner = owner;
        this.group_owner = group_owner;
        this.permissions = other?.permissions ?? DEFAULT_FILE_PERMISSIONS; // This doesn't matter because it'll be overwritten anyway
        this.setuid = other?.setuid ?? false;
        // @ts-ignore: Class inheritance problems :/
        this.parent = other?.parent;

        if (this.parent) {
            this.parent.add_child(this);
        }
    }

    is_file(): boolean {
        return false;
    }

    is_directory(): boolean {
        return false;
    }

    check_permissions(permission: PermissionType): Result<void> {
        /**
         * Checks if the current user has the given `permission`
         * @param {PermissionType} permission The permission to check
         *
         * @returns {Result<void>} The result of the check (true if the user has the permission, false otherwise)
         */
        // If we're root (uid 0), we can do anything
        if (computer.sys$geteuid() === 0) {
            return new Result({success: true});
        }

        // If "public" is set, don't bother checking anything else
        if (this.permissions.other[permission]) {
            return new Result({success: true});
        }

        if (this.permissions.group[permission]) {
            // TODO: Support groups with multiple users
            if (computer.sys$getegid() === this.group_owner) {
                return new Result({success: true});
            }
        }

        if (this.permissions.owner[permission]) {
            if (computer.sys$geteuid() === this.owner) {
                return new Result({success: true});
            }
        }

        return new Result({success: false, message: ResultMessages.NOT_ALLOWED});
    }

    check_owner(): Result<void> {
        /**
         * Checks if the current UID or GID is one of the owner of this object (for chmod/chgrp/etc)
         * @returns {Result<void>} The result of the check (true if the user is the owner, false otherwise)
         */
        if (computer.sys$geteuid() === this.owner) {
            return new Result({success: true});
        }

        // TODO: Check groups

        return new Result({success: false, message: ResultMessages.NOT_ALLOWED});
    }

    change_owner(uid?: number, gid?: number): Result<void> {
        /**
         * Changes the owner of this object (if allowed)
         * @param {number} [uid] The new UID
         * @param {number} [gid] The new GID
         * @returns {Result<void>} The result of the change (true if the change was successful, false otherwise)
         */
        if (this.check_owner().ok() || computer.sys$geteuid() === 0) {
            if (uid !== undefined) {
                this.owner = uid;
            }

            if (gid !== undefined) {
                this.group_owner = gid;
            }

            // TODO: Handle event (change owner)
            return new Result({success: true});
        }
        return new Result({success: false, message: ResultMessages.NOT_ALLOWED});
    }

    pwd(): string {
        /**
         * Returns the full path to this object
         * @returns {string} The full path to this object
         */
            // Start from ourselves and work our way down the parent chain
        let current_dir = this;
        let working_dir = [];

        while (true) {
            working_dir.push(current_dir.name);
            if (current_dir.parent === undefined) {
                break;
            }
            // @ts-ignore: If parent doesn't exist, the above will handle it
            current_dir = current_dir.parent;
        }

        working_dir.reverse();
        let final_path = working_dir.join("/");
        // Try to remove double slash at the beginning (if it exists)
        if (final_path.startsWith("//"))
            final_path = final_path.substring(1);

        return final_path;
    }

    delete_self(): Result<void> {
        /**
         * Deletes this object (if allowed)
         * @returns {Result<void>} The result of the deletion (true if the deletion was successful, false otherwise)
         */
        if (this.parent !== undefined) {
            // In unix, we need read+write permission to delete
            if (this.check_permissions("read").ok() && this.check_permissions("write").ok()) {
                // TODO: this.handle_event('delete');
                return this.parent.delete_child(this.name);
            } else
                return new Result({success: false, message: ResultMessages.NOT_ALLOWED});
        }
        return new Result({success: false, message: ResultMessages.NOT_ALLOWED});
    }

    add_event_listener(event: EventType, callback: (file: FSBaseObject) => void, when: "before" | "after" = "after"): Result<number> {
        // TODO: Implement
        alert("FSBaseObject::add_event_listener() not implemented");
        throw new Error("FSBaseObject::add_event_listener() not implemented");
    }

    remove_event_listener(id: number): Result<void> {
        alert("FSBaseObject::remove_event_listener() not implemented");
        throw new Error("FSBaseObject::remove_event_listener() not implemented");
    }

    handle_event(event: EventType): Result<void> {
        alert("FSBaseObject::handle_event() not implemented");
        throw new Error("FSBaseObject::handle_event() not implemented");
    }

    get_name(): string {
        return this.name;
    }

    get_size(): number {
        return 0;
    }

    set_parent(parent: FSBaseObject): void {
        // @ts-ignore: Class inheritance problems :/
        this.parent = parent;
    }

    set_permissions(permissions: InodePermissions): void {
        this.permissions = permissions;
    }
}

export class File extends FSBaseObject {
    protected content: string = "";

    constructor(name: string, owner: number, group_owner: number, other?: FileOtherOptions) {
        super(name, owner, group_owner, other);
        this.permissions = other?.permissions ?? DEFAULT_FILE_PERMISSIONS;
        this.content = other?.content ?? "";
        this.size = this.content.length;
    }

    read(): Result<string> {
        /**
         * Reads the content of this file
         * @returns {Result<string>} The result of the read (the content of the file)
         */
        if (this.check_permissions("read").ok()) {
            // TODO: this.handle_event('read');
            return new Result({
                success: true,
                data: this.content,
            });
        }
        return new Result({success: false, message: ResultMessages.NOT_ALLOWED_READ});
    }

    write(content: string): Result<void> {
        /**
         * Writes the given content to this file
         * @param {string}
         * @returns {Result<void>} The result of the write (true if the write was successful, false otherwise)
         */
        if (this.check_permissions("write").ok()) {
            this.content = content;
            this.update_size();
            // TODO: this.handle_event('write');
            return new Result({success: true});
        } else
            return new Result({success: false, message: ResultMessages.NOT_ALLOWED_WRITE});
    }

    append(content: string): Result<void> {
        /**
         * Appends the given content to this file
         * @param {string}
         * @returns {Result<void>} The result of the append (true if the append was successful, false otherwise)
         */
        if (this.check_permissions("write").ok()) {
            this.content += content;
            this.update_size();
            // TODO: this.handle_event('write');
            return new Result({success: true});
        } else
            return new Result({success: false, message: ResultMessages.NOT_ALLOWED_WRITE});
    }

    update_size(): void {
        /**
         * Updates the size of this file
         */
        // First, update our own size
        this.size = this.content.length;

        // Now, recursively update the size of our parent
        if (this.parent !== undefined)
            this.parent.update_size();

    }

    get_perm_octal(): string {
        /**
         * Returns the permissions of this file in octal notation
         * @returns {string}
         */
        // TODO: Implement
        alert("File::get_perm_octal() not implemented");
        throw new Error("File::get_perm_octal() not implemented");
    }

    is_file(): boolean {
        return true;
    }
}

export class Directory extends FSBaseObject {
    protected children: { [name: string]: FSBaseObject } = {};

    constructor(name: string, owner: number, group_owner: number, other?: FSBaseObjectOtherOptions) {
        super(name, owner, group_owner, other);
        this.permissions = other?.permissions ?? DEFAULT_DIR_PERMISSIONS;
        this.update_size();
    }

    add_child(child: FSBaseObject): Result<void> {
        /**
         * Adds a child to this directory
         * @param {FSBaseObject}
         * @returns {Result<void>} The result of the add (true if the add was successful, false otherwise)
         */
        // Check if we already have a child with the same name
        if (this.children[child.get_name()] !== undefined)
            return new Result({success: false, message: ResultMessages.ALREADY_EXISTS});

        this.children[child.get_name()] = child;
        child.set_parent(this);
        this.update_size();

        // TODO: this.handle_event('write');

        return new Result({success: true});

    }

    delete_child(name: string): Result<void> {
        /**
         * Deletes the child with the given name
         * @param {string}
         * @returns {Result<void>} The result of the deletion (true if the deletion was successful, false otherwise)
         */
        if (this.children[name] !== undefined) {
            delete this.children[name];
            this.update_size();
            return new Result({success: true});
        } else
            return new Result({success: false, message: ResultMessages.NOT_FOUND});
    }

    protected calculate_size(): number {
        /**
         * Calculates the size of this directory (does not set)
         * @returns {number}
         */
        let total = 0;
        for (let child in this.children) {
            if (this.children[child].is_file())
                total += this.children[child].get_size();
            else
                // @ts-ignore: Class inheritance problems :/
                total += this.children[child].calculate_size();
        }
        return total;
    }

    update_size(): void {
        /**
         * Updates the size of this directory
         */
        this.size = this.calculate_size();
        if (this.parent !== undefined)
            this.parent.update_size();
    }

    get_child(name: string): Result<FSBaseObject> {
        /**
         * Returns the child with the given name
         * @param {string} name
         * @returns {Result<FSBaseObject>} The result of the get (the child with the given name)
         */
        if (this.children[name] !== undefined)
            return new Result({success: true, data: this.children[name]});
        return new Result({success: false, message: ResultMessages.NOT_FOUND});
    }

    get_children(): FSBaseObject[] {
        /**
         * Returns all children of this directory
         * @returns {FSBaseObject[]}
         */
        let children: FSBaseObject[] = [];
        for (let child in this.children)
            children.push(this.children[child]);
        return children;
    }

    is_directory(): boolean {
        return true;
    }
}

export class StandardFS {
    private root: Directory = new Directory("/", 0, 0);

    constructor() {
        this.init();
    }

    init(): void {
        for (let dir of ["bin", "etc", "home", "lib", "mnt", "opt", "proc", "root", "sbin", "tmp", "usr", "var"]) {
            let directory = new Directory(dir, 0, 0, {parent: this.root});

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
        this.setup_home();
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

    setup_home(): void {
        // This is only temporary, we'll have the user setup their own home directory
        // @ts-ignore
        new Directory("user", 1000, 1000, {parent: this.root.get_child("home").get_data()});
    }

    find(path: Path): Result<FSBaseObject> {
        // TODO: Redo this better
        if (path.get_path() === "/")
            return new Result({success: true, data: this.root});

        let can_path = path.canonicalize();
        let parts = can_path.get_parts();

        let current = this.root;

        for (let part of parts) {
            let child = current.get_child(part);
            if (child.fail())
                return new Result({success: false, message: ResultMessages.NOT_FOUND});

            // @ts-ignore
            current = child.get_data();
        }

        return new Result({success: true, data: current});
    }
}