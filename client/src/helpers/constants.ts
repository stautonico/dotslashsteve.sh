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


export const DEFAULT_TERM_PREFS = {
    "colors": {
        "background": "#000000",
        "foreground": "#ffffff",

        "cursor": "#ffffff",

        "white": "#fff",
        "light-white": "#fafafa",
        "black": "#000",
        "light-black": "#333",
        "red": "#ff0000",
        "light-red": "#ff9999",
        "green": "#00ff00",
        "light-green": "#99ff99",
        "yellow": "#ffff00",
        "light-yellow": "#ffff99",
        "blue": "#0000ff",
        "light-blue": "#9999ff",
        "purple": "#ff00ff",
        "light-purple": "#ff99ff",
        "cyan": "#00ffff",
        "light-cyan": "#99ffff",
    },
    "font": "Fira Mono",
    "font-size": "16px",
}