import {print}  from "../util/io";
import {computer} from "../util/globals";

export function main(_args: string[]): number {
    const current_session = computer.current_session();

    const uid = current_session.get_effective_uid();

    const user = computer.get_user_by_uid(uid);

    if (user) {
        print(user.get_username());
    } else {
        print("?");
    }

    return 0;
}