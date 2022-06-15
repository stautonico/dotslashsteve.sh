import {computer} from "../../src/helpers/globals";

beforeAll(async () => {
    const result = await computer.add_user("user", "password", {home_dir: "/home/user"});
    expect(result.ok()).toBeTruthy();
    if (result.ok()) {
        const res = computer.new_session(result.get_data()!.get_uid());
        if (!res) {
            alert("Failed to create new session, terminating.");
            return;
        }
    }
});


test("read: successful read", () => {
    console.log(computer.sys$geteuid());
});