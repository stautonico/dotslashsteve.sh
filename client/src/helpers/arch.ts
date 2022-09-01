// This code is from https://github.com/feross/arch/blob/master/browser.js
// I"m copy-pasting it because I couldn"t figure out how to import it from the
// npm package
// I"m just going to slightly modify it to make eslint happy
export function arch() {
    /**
     * User agent strings that indicate a 64-bit OS.
     * See: http://stackoverflow.com/a/13709431/292185
     */
    let userAgent = navigator.userAgent;
    if ([
        "x86_64",
        "x86-64",
        "Win64",
        "x64;",
        "amd64",
        "AMD64",
        "WOW64",
        "x64_64"
    ].some(function (str) {
        return userAgent.indexOf(str) > -1;
    })) {
        return "x86_64";
    }

    /**
     * Platform strings that indicate a 64-bit OS.
     * See: http://stackoverflow.com/a/19883965/292185
     */
    let platform = navigator.platform;
    if (platform === "MacIntel" || platform === "Linux x86_64") {
        return "x86_64";
    }

    /**
     * CPU class strings that indicate a 64-bit OS.
     * See: http://stackoverflow.com/a/6267019/292185
     */
    // @ts-ignore
    if (navigator.cpuClass === "x64") {
        return "x86_64";
    }

    /**
     * If none of the above, assume the architecture is 32-bit.
     */
    return "x86";
}