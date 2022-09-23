import {computer} from "../util/globals";

export function getallenv(): { [key: string]: string } {
    return computer.current_session().getallenv();
}

export function getenv(name: string): string | undefined {
    return computer.get_env(name);
}

export function setenv(name: string, value: string, overwrite = true): boolean {
    if (!overwrite) {
        if (getenv(name)) return false;
    }
    computer.set_env(name, value);
    return true;
}

export function unsetenv(name: string): boolean {
    return computer.unset_env(name).ok();
}
