// If we're using node, import the crypto module and use the crypto.subtle module
// If we're using the browser, we'll use the global crypto module
// The only time we'll ever be using node is when we're testing
import {encode, decode} from "./encode";

export async function sha1hash(text: string): Promise<string> {
    return new Promise(async (resolve) => {
        if (typeof crypto !== "undefined") {
            // @ts-ignore
            const hash = await crypto.subtle.digest("SHA-1", encode(text));
            // @ts-ignore
            resolve(decode(hash));
        } else {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const crypto = require("crypto");
            resolve(crypto.createHash("sha1").update(text).digest("hex"));
        }
    });
}