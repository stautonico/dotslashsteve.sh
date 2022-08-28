// If we're using node, import TextEncoder and TextDecoder
// If we're using the browser, we'll use the global TextEncoder and TextDecoder
// The only time we'll ever be using node is when we're testing
export function encode(text: string): Uint8Array {
    if (typeof TextEncoder !== "undefined") {
        return new TextEncoder().encode(text);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const util = require("util");
        return new util.TextEncoder().encode(text);
    }
}

export function decode(encoded: Uint8Array): string {
    if (typeof TextEncoder !== "undefined") {
        return new TextDecoder().decode(encoded);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const util = require("util");
        return new util.TextDecoder().decode(encoded);
    }
}