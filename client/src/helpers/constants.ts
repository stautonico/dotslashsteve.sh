import {InodePermissions} from "../fs/inode";


export const PROC_DIR_PERMISSIONS: InodePermissions = {
    owner: {
        read: true,
        write: false,
        execute: true,
    },
    group: {
        read: true,
        write: false,
        execute: true,
    },
    other: {
        read: true,
        write: false,
        execute: true,
    }
}

export const ROOT_DIR_PERMISSIONS: InodePermissions = {
    owner: {
        read: true,
        write: true,
        execute: true,
    },
    group: {
        read: true,
        write: false,
        execute: true,
    },
    other: {
        read: false,
        write: false,
        execute: false,
    }
}

export const SYS_DIR_PERMISSIONS: InodePermissions = {
    owner: {
        read: true,
        write: false,
        execute: true,
    },
    group: {
        read: true,
        write: false,
        execute: true,
    },
    other: {
        read: true,
        write: false,
        execute: true,
    }
}

export const TMP_DIR_PERMISSIONS: InodePermissions = {
    owner: {
        read: true,
        write: true,
        execute: true,
    },
    group: {
        read: true,
        write: true,
        execute: true,
    },
    other: {
        read: true,
        write: true,
        execute: true,
    }
}


export const TERMINAL_FONTS = ["source-code-pro", "arial", "verdana", "helvetica", "tahoma", "trebuchet-ms",
    "times-new-roman", "georgia", "haramond", "courier-new", "brush-script-mt", "sans-serif", "serif", "monospace",
    "cursive"];

/*
bin and lib and sbin
 */