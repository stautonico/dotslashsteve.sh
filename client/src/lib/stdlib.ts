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
    console.log(computer.set_env(name, value));
    return true;
}

export function unsetenv(name: string): boolean {
    return computer.unset_env(name).ok();
}

export function listenv(): { [key: string]: string } {
    // We don't have PTRs, so we'll just have to write a function to do this
    let get_keys = computer.list_env();
    if (get_keys.fail())
        return {};

    // TODO: Get each key and value
    // TODO: Maybe just write a function in computer so we don't have to get each value manually?
    let env: { [key: string]: string } = {};
    // @ts-ignore
    for (let key of get_keys.get_data()) {
        let get_value = computer.get_env(key);
        if (get_value)
            env[key] = get_value;
    }

    return env;
}
