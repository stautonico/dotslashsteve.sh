import {computer} from "../../src/util/globals";

beforeAll(async () => {
    const result = await computer.add_user("user", "password", {home_dir: "/home/user"});
    /* eslint-disable */
    expect(result.ok()).toBeTruthy();
    expect(result.get_data()).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: This will be defined because the previous line said so
    const res = computer.new_session(result.get_data().get_uid());
    expect(res).toBeTruthy();
    /* eslint-enable */
});

describe("read", () => {
    it("should read a valid file successfully", () => {
        const result = computer.sys$read("/etc/passwd");
        expect(result.ok()).toBeTruthy();
        expect(result.get_data()).toBe("root:x:0:0:root:/root:/bin/bash\n");
    });

    it("should fail to read an invalid file", () => {
        const result = computer.sys$read("/etc/doesntexist");
        expect(result.ok()).toBeFalsy();
        expect(result.get_data()).toBeUndefined();
    });

    it("should fail to read a directory", () => {
        const result = computer.sys$read("/etc");
        expect(result.ok()).toBeFalsy();
        expect(result.get_data()).toBeUndefined();
    });

    it("should fail to read a file without permission", () => {
        const result = computer.sys$read("/etc/shadow");
        expect(result.ok()).toBeFalsy();
        expect(result.get_data()).toBeUndefined();
    });
});
