import {Terminal} from "../terminal";

// Note: The meta key is the "Command" key in macOS, "OS" is the windows key in linux/windows
export const MODIFIER_KEYS = ["Shift", "Control", "Alt", "Meta", "OS"];

type KeyboardShortcutCallback = (term: Terminal) => void;

interface RequiredKeys {
    modifiers: string[],
    key: string
}

export class KeyboardShortcut {
    private readonly _callback: KeyboardShortcutCallback;
    private readonly _callback_argument: Terminal;
    private _required_keys: RequiredKeys = {
        modifiers: [],
        key: ""
    };

    constructor(shortcut: string, callback: KeyboardShortcutCallback, callback_argument: Terminal) {
        this._callback = callback;
        this._callback_argument = callback_argument;

        // We need to parse the input and create the required keys object
        let split_string = shortcut.split("+");
        for (let i = 0; i < split_string.length; i++) {
            let key = split_string[i];

            // Clean up the key
            key = key.replaceAll(" ", "");

            if (MODIFIER_KEYS.includes(key)) {
                this._required_keys.modifiers.push(key);
            } else {
                this._required_keys.key = key.toLowerCase();
            }
        }
    }

    public isPressed(modifiers: {[key: string]: boolean}, key: string): boolean {
        // For now, the key is not case-sensitive as shift is handled as an individual key
        key = key.toLowerCase();
        for (let mod of this._required_keys.modifiers) {
            if (!modifiers[mod]) return false;
        }

        // Make sure we're not pressing any keys that we shouldn't (so Control + Shift + C doesn't activate Control + C)
        for (let mod in modifiers) {
            // eslint-disable-next-line no-prototype-builtins
            if (modifiers.hasOwnProperty(key)) {
                // If the key is pressed, and it's not in our required modifiers, return false
                if (modifiers[mod] && !this._required_keys.modifiers.includes(mod)) return false;
            }
        }

        // At this point, we should have all our modifiers, we just need to check our non-modifier key
        if (key === this._required_keys.key) {
            // We have our keyboard shortcut
            this._callback(this._callback_argument);
            return true;
        }

        // If we reached the end, we have not handled our shortcut
        return false;
    }
}