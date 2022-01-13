<script>
    import {onMount} from "svelte";
    import {url} from "@roxi/routify";

    onMount(() => {
        window.location.href = `/error/404?path=${$url()}`;
    });
</script>
<!--<svelte:body use:classList={"error-page-body"}/>-->
<!--<div id="error-container">-->
<!--    &lt;!&ndash;    <Body {style}/>&ndash;&gt;-->
<!--    <div class="scanlines"></div>-->
<!--    <div id="terminal">-->
<!--        <h1 id="error-title">{@html title}</h1>-->
<!--        <p class="output" id="description-line" class:show-indent={indentDescriptionLine}-->
<!--           class:blink-cursor={showCursor && currentLine==="description"}>{descriptionLine}</p>-->
<!--        <p class="output" id="link-line" class:show-indent={indentLinkLine}-->
<!--           class:blink-cursor={showCursor && currentLine==="link"}>{@html linkLine}</p>-->
<!--    </div>-->
<!--</div>-->

<!--<script>-->
<!--    import {onMount} from "svelte";-->
<!--    import {goto} from "@roxi/routify";-->
<!--    import {classList} from "svelte-body";-->

<!--    let titleToShow = "Error <>404</>";-->
<!--    let descriptionLineToShow = "The page you are looking for might have been removed, had its name changed or is temporarily unavailable";-->
<!--    let linkLineToShow = "You could try <>going back</> or <>going home</>";-->

<!--    let indentDescriptionLine = false;-->
<!--    let indentLinkLine = false;-->

<!--    let title = "";-->
<!--    let descriptionLine = "";-->
<!--    let linkLine = "";-->

<!--    let wroteLinkOne = false;-->

<!--    let currentLine = "title";-->
<!--    let showCursor = true;-->
<!--    let doneTyping = false;-->

<!--    const SPEED = 25;-->

<!--    // Global styles for the body-->
<!--    const style = {-->
<!--        cursor: "default",-->
<!--        overflow: "hidden",-->
<!--        fontFamily: "Inconsolata, monospace",-->
<!--        minHeight: "100%",-->
<!--        boxSizing: "border-box",-->
<!--        backgroundColor: "#000000",-->
<!--        backgroundImage: "radial-gradient(#11581E, #041607)",-->
<!--        color: "rgba(128, 255, 128, 0.8)",-->
<!--        textShadow: "0 0 1ex rgba(51, 255, 51, 1), 0 0 2px rgba(255, 255, 255, 0.8)",-->
<!--        fontSize: "24px"-->
<!--    }-->

<!--    async function sleep(ms) {-->
<!--        return new Promise(resolve => setTimeout(resolve, ms));-->
<!--    }-->

<!--    window.goBack = () => {-->
<!--        window.history.back();-->
<!--    }-->

<!--    window.goHome = () => {-->
<!--        $goto("/");-->
<!--    }-->

<!--    onMount(async () => {-->
<!--        // Start the cursor blinking-->
<!--        setInterval(() => {-->
<!--            if (doneTyping) showCursor = !showCursor;-->
<!--            else showCursor = true;-->
<!--        }, 500);-->

<!--        // Loop through the title-->
<!--        for (let i = 0; i < titleToShow.length; i++) {-->
<!--            // If we're starting a span tag-->
<!--            if (titleToShow[i] === "<") {-->
<!--                // Peek ahead to see if we're at the start of a link-->
<!--                if (titleToShow[i + 1] !== "/") {-->
<!--                    let j = i + 1;-->
<!--                    let inLinkText = false;-->
<!--                    while (true) {-->
<!--                        if (titleToShow[j] === ">") {-->
<!--                            inLinkText = true;-->
<!--                            j++;-->
<!--                        }-->

<!--                        if (titleToShow[j] === "<") {-->
<!--                            break;-->
<!--                        }-->
<!--                        j++;-->
<!--                    }-->
<!--                    // Quickly inject the opening tag-->
<!--                    title += "<span class=\"error-code\">";-->
<!--                    i += 2;-->
<!--                } else {-->
<!--                    // We're at the end of a link-->
<!--                    linkLine += "</span>";-->
<!--                    i += 3;-->
<!--                }-->
<!--            }-->
<!--            if (titleToShow[i] === undefined) break;-->
<!--            title += titleToShow[i];-->
<!--            await sleep(SPEED);-->
<!--        }-->

<!--        // Loop through the description line-->
<!--        indentDescriptionLine = true;-->
<!--        currentLine = "description";-->
<!--        for (let i = 0; i < descriptionLineToShow.length; i++) {-->
<!--            descriptionLine += descriptionLineToShow[i];-->
<!--            await sleep(SPEED);-->
<!--        }-->

<!--        // Loop through the link line-->
<!--        indentLinkLine = true;-->
<!--        currentLine = "link";-->
<!--        for (let i = 0; i < linkLineToShow.length; i++) {-->
<!--            // If we're starting a link-->
<!--            if (linkLineToShow[i] === "<") {-->
<!--                // Peek ahead to see if we're at the start of a link-->
<!--                if (linkLineToShow[i + 1] !== "/") {-->
<!--                    // Find the text of the link-->
<!--                    let j = i + 1;-->
<!--                    let inLinkText = false;-->
<!--                    while (true) {-->
<!--                        if (linkLineToShow[j] === ">") {-->
<!--                            inLinkText = true;-->
<!--                            j++;-->
<!--                        }-->

<!--                        if (linkLineToShow[j] === "<") {-->
<!--                            break;-->
<!--                        }-->
<!--                        j++;-->
<!--                    }-->
<!--                    // Quickly inject the opening tag-->
<!--                    if (!wroteLinkOne) {-->
<!--                        linkLine += '<a id="link-one" onclick="goBack()">';-->
<!--                        wroteLinkOne = true;-->
<!--                    } else {-->
<!--                        linkLine += '<a id="link-two" onclick="goHome()">';-->
<!--                    }-->
<!--                    i += 2;-->
<!--                } else {-->
<!--                    // We're at the end of a link-->
<!--                    linkLine += "</a>";-->
<!--                    i += 3;-->
<!--                }-->
<!--            }-->
<!--            if (linkLineToShow[i] === undefined) break;-->
<!--            linkLine += linkLineToShow[i];-->
<!--            // title.innerHTML = linkLine;-->
<!--            await sleep(SPEED);-->
<!--        }-->

<!--        doneTyping = true;-->
<!--    });-->


<!--</script>-->

<!--<style>-->
<!--    @font-face {-->
<!--        font-family: 'Inconsolata';-->
<!--        font-style: normal;-->
<!--        font-weight: 400;-->
<!--        font-stretch: normal;-->
<!--        src: url(https://fonts.gstatic.com/s/inconsolata/v21/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WRL2l2eY.woff2) format('woff2');-->
<!--        unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;-->
<!--    }-->

<!--    /* latin-ext */-->
<!--    @font-face {-->
<!--        font-family: 'Inconsolata';-->
<!--        font-style: normal;-->
<!--        font-weight: 400;-->
<!--        font-stretch: normal;-->
<!--        src: url(https://fonts.gstatic.com/s/inconsolata/v21/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WRP2l2eY.woff2) format('woff2');-->
<!--        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;-->
<!--    }-->

<!--    /* latin */-->
<!--    @font-face {-->
<!--        font-family: 'Inconsolata';-->
<!--        font-style: normal;-->
<!--        font-weight: 400;-->
<!--        font-stretch: normal;-->
<!--        src: url(https://fonts.gstatic.com/s/inconsolata/v21/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32lw.woff2) format('woff2');-->
<!--        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;-->
<!--    }-->

<!--    ::selection {-->
<!--        color: none;-->
<!--        background: none;-->
<!--    }-->

<!--    /* For Mozilla Firefox */-->
<!--    ::-moz-selection {-->
<!--        color: none;-->
<!--        background: none;-->
<!--    }-->

<!--    :global(.error-page-body) {-->
<!--        cursor: default;-->
<!--        overflow: hidden;-->
<!--        font-family: Inconsolata, monospace;-->
<!--        min-height: 100%;-->
<!--        box-sizing: border-box;-->
<!--        background-color: #000000;-->
<!--        background-image: radial-gradient(#11581E, #041607);-->
<!--        color: rgba(128, 255, 128, 0.8);-->
<!--        text-shadow: 0 0 1ex rgba(51, 255, 51, 1), 0 0 2px rgba(255, 255, 255, 0.8);-->
<!--        font-size: 24px;-->
<!--    }-->

<!--    :global(html) {-->
<!--        height: 100%; /* Idk why, but the background gradient disappears without this */-->
<!--    }-->

<!--    #error-container #error-title {-->
<!--        color: rgba(128, 255, 128, 0.8) !important;-->
<!--    }-->

<!--    #terminal {-->
<!--        box-sizing: inherit;-->
<!--        position: absolute;-->
<!--        height: 100%;-->
<!--        width: 1000px;-->
<!--        max-width: 100%;-->
<!--        padding: 96px !important;-->
<!--        text-transform: uppercase;-->
<!--    }-->

<!--    .output {-->
<!--        color: rgba(128, 255, 128, 0.8) !important;-->
<!--        text-shadow: 0 0 1px rgba(51, 255, 51, 0.4),-->
<!--        0 0 2px rgba(255, 255, 255, 0.8) !important;-->
<!--    }-->

<!--    #error-container :global(.show-indent::before) {-->
<!--        content: "> ";-->
<!--    }-->

<!--    #error-container :global(a) {-->
<!--        color: #fff;-->
<!--        text-decoration: none;-->
<!--        transition: color 500ms;-->
<!--        cursor: pointer !important;-->
<!--    }-->

<!--    #error-container :global(a:hover) {-->
<!--        color: #c3c3c3;-->
<!--    }-->

<!--    #error-container :global(a::before) {-->
<!--        content: "[";-->
<!--    }-->

<!--    #error-container :global(a::after) {-->
<!--        content: "]";-->
<!--    }-->

<!--    #error-container :global(.error-code) {-->
<!--        color: white;-->
<!--    }-->

<!--    #error-container :global(.blink-cursor::after) {-->
<!--        content: "|";-->
<!--    }-->

<!--    .scanlines {-->
<!--        pointer-events: none;-->
<!--        position: absolute;-->
<!--        width: 100%;-->
<!--        height: 100%;-->
<!--        background: repeating-linear-gradient(-->
<!--                180deg,-->
<!--                rgba(0, 0, 0, 0) 0,-->
<!--                rgba(0, 0, 0, 0.3) 50%,-->
<!--                rgba(0, 0, 0, 0) 100%-->
<!--        );-->
<!--        background-size: auto 4px;-->
<!--        z-index: 99;-->
<!--    }-->

<!--    .scanlines::before {-->
<!--        content: "";-->
<!--        pointer-events: none;-->
<!--        position: absolute;-->
<!--        display: block;-->
<!--        top: 0;-->
<!--        left: 0;-->
<!--        right: 0;-->
<!--        bottom: 0;-->
<!--        width: 100%;-->
<!--        height: 100%;-->
<!--        background-image: linear-gradient(-->
<!--                0deg,-->
<!--                transparent 0%,-->
<!--                rgba(32, 128, 32, 0.2) 2%,-->
<!--                rgba(32, 128, 32, 0.8) 3%,-->
<!--                rgba(32, 128, 32, 0.2) 3%,-->
<!--                transparent 100%);-->
<!--        background-repeat: no-repeat;-->
<!--        animation: scan 7.5s linear 0s infinite;-->
<!--    }-->

<!--    /* Animations */-->
<!--    @keyframes scan {-->
<!--        0% {-->
<!--            background-position: 0 -100vh;-->
<!--        }-->
<!--        35%, 100% {-->
<!--            background-position: 0 100vh;-->
<!--        }-->
<!--    }-->
<!--</style>-->