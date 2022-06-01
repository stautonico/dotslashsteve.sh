setTimeout(() => {
    // @ts-ignore
    window.top.postMessage("site", "*");
}, 1000);