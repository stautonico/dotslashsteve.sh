<div>
    <div id="terminal" class="no-select" class:cursor={cursor}>
        {@html currentString}
    </div>
</div>

<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";

    const dispatch = createEventDispatcher();

    const NPM_PACKAGE_AMOUNT = 805;

    const COMPUTERS = ["skynet", "hp3000", "hal9000", "wopr", "GlaDOS", "joshua", "alpha60", "localhost"];

    const CURRENT_COMPUTER_NAME = COMPUTERS[Math.floor(Math.random() * COMPUTERS.length)];

    let currentDir = "~";

    let prompt = `<span id="username">steve</span>@<span id="computer">${CURRENT_COMPUTER_NAME}</span>:<span id="directory">${currentDir}</span>$ `;

    let currentString = prompt;

    let cursor = false;
    let allowInput = false;
    let writing = false;

    const browserCommands = {
        "Chrome": "google-chrome",
        "Firefox": "firefox",
        "Opera": "opera",
        "Edge": "edge",
        "Safari": "safari"
    }

    let blinkCounter = setInterval(() => {
        if (!writing)
            cursor = !cursor;
    }, 500);

    if (allowInput) {
        document.body.addEventListener("keydown", (event) => {
            if (event.key.length === 1 && (event.key.match(/[a-z\s]/i)) || ["enter", "backspace", "space"].indexOf(event.key.toLowerCase()) !== -1) {
                if (event.key === "Backspace") {
                    currentString = currentString.slice(0, -1);
                } else if (event.key === "Enter") {
                    let currentCommand = currentString.replace(prompt, "");
                    currentString += `\n${prompt}`;
                    console.log(currentCommand);
                } else {
                    currentString += event.key;
                }
            }
        });
    }

    async function addString(text: string) {
        currentString += text;
        await sleep(getRandomInt(40, 80));
    }

    function newLine(directory = "", noprompt = false) {
        if (noprompt) {
            currentString += "<br />";
        } else {
            if (directory) {
                currentDir = directory;
            }

            prompt = `<span id="username">steve</span>@<span id="computer">${CURRENT_COMPUTER_NAME}</span>:<span id="directory">${currentDir}</span>$ `;

            currentString += "<br />" + prompt;
        }
    }

    // Simulates typing into prompt (user input)
    async function writeInput(toWrite: string) {
        writing = true;
        return new Promise<void>(async (resolve) => {
            for (let i = 0; i < toWrite.length; i++) {
                await addString(toWrite[i]);
            }
            writing = false;
            resolve();
        });
    }

    async function writeLink(toWrite: string, url?: string) {
        writing = true;
        return new Promise<void>(async (resolve) => {
            if (!url) {
                url = toWrite;
            }
            // Write the beginning of the url
            currentString += `<a href='${url}' target="_blank">`

            for (let i = 0; i < toWrite.length; i++) {
                await addString(toWrite[i]);
            }
            // Add the link ending
            currentString += "</a>";
            writing = false;
            resolve();
        });
    }

    // Simulates output from the binary
    async function writeOutput(toWrite: string, newline = true) {
        writing = false;
        cursor = false;
        return new Promise<void>(async (resolve) => {
            if (newline) {
                // currentString = currentString + "<br />" + toWrite;
                currentString += "<br />" + toWrite;
            } else {
                currentString += toWrite;
            }
            writing = true;
            resolve();
        });
    }

    async function deleteTopLine() {
        return new Promise<void>(async (resolve) => {
            let splitString = currentString.split("<br />");
            splitString.shift();
            currentString = splitString.join("<br />");
            resolve();
        });
    }

    async function deleteBottomLine() {
        return new Promise<void>(async (resolve) => {
            let splitString = currentString.split("<br />");
            splitString.pop();
            currentString = splitString.join("<br />");
            resolve();
        });
    }

    // Helper functions
    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getBrowser() {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

    function showMainSite() {
        dispatch('message', {
            text: 'showmainsite'
        });
    }


    async function main() {
        await sleep(1000);
        await writeInput("git clone ");
        await writeLink("https://github.com/stautonico/dotslashsteve.sh");
        await sleep(350);
        await writeOutput("Cloning into 'dotslashsteve.sh'...");
        await sleep(50);
        await writeOutput("remote: Enumerating objects: 532, done.");
        await sleep(50);
        await writeOutput("remote: Counting objects: 100% (532/532), done.");
        await sleep(50);
        await writeOutput("remote: Compressing objects: 100% (467/467), done.");
        await sleep(50);
        await writeOutput("remote: Total 532 (delta 230), reused 312 (delta 25), pack-reused 0");
        await sleep(50);
        await writeOutput("Receiving objects: 100% (532/532), 593.01 KiB | 6.24 MiB/s, done.");
        await sleep(50);
        await writeOutput("Resolving deltas: 100% (230/230), done.");
        await sleep(50);
        newLine();
        await sleep(500);
        await writeInput("cd dotslashsteve.sh/client");
        await sleep(50);
        newLine("~/dotslashsteve.sh/client");
        // 1/3 chance of building without installing packages first
        const generateWithFail = getRandomInt(0, 2);
        if (generateWithFail == 0) {
            await sleep(440);
            await writeInput("npm run build");
            await sleep(50);
            await newLine(null, true);
            await sleep(500);
            await writeOutput("> build", true);
            await writeOutput("> routify -b && vite build");
            await sleep(50);
            await newLine(null, true);
            await writeOutput("sh: line 1: routify: command not found", true);
            newLine();
        }
        await sleep(500);
        await writeInput("npm i");
        await sleep(50);
        for (let i = 0; i < NPM_PACKAGE_AMOUNT; i++) {
            await writeOutput(`Installing packages: ${Math.round((i / NPM_PACKAGE_AMOUNT) * 100)}% (${i}/${NPM_PACKAGE_AMOUNT})`);
            await sleep(0.5);
            await deleteBottomLine();
        }
        await writeOutput(`Installing packages: 100 (${NPM_PACKAGE_AMOUNT}/${NPM_PACKAGE_AMOUNT}), done.`);
        await sleep(300);
        await newLine();
        await sleep(300);
        await writeInput("npm run build");
        await sleep(50);
        await newLine(null, true);
        await sleep(500);
        await writeOutput("> build", true);
        await writeOutput("> routify -b && vite build");
        await sleep(50);
        await writeOutput("vite v2.5.10 building for production...");
        await sleep(500);
        await writeOutput("dist/index.html                  2.30 KiB");
        await writeOutput("dist/assets/index.e5961dc5.css   3.38 KiB / brotli: 0.89 KiB");
        await writeOutput("dist/assets/index.7f9381c1.js    6.79 KiB / brotli: 2.49 KiB");
        await writeOutput("dist/assets/vendor.44f7e1c6.js   26.68 KiB / brotli: 9.23 KiB");
        await newLine();
        await sleep(880);
        await writeInput("cd dist");
        await sleep(50);
        await newLine("~/dotslashsteve.sh/client/dist");
        await sleep(300);

        await writeInput("sudo cp * /var/www/dotslashsteve.sh/public");
        await sleep(150);
        // Set writing to not show cursor (maybe rename)
        writing = true;
        cursor = true;
        await writeOutput("[sudo] password for steve: ");
        await sleep(1500);
        // 1/4 chance of entering incorrect password
        const wrongPassword = getRandomInt(0, 3);
        if (wrongPassword == 0) {
            await newLine(null, true);
            cursor = false;
            await sleep(1500);
            await deleteBottomLine();
            await writeOutput("Sorry, try again.");
            await sleep(500);
            cursor = true;
            await writeOutput("[sudo] password for steve: ");
            await sleep(1500);
        }
        writing = false;
        newLine();


        writing = false;
        let command: string
        try {
            // @ts-ignore
            command = browserCommands[getBrowser().split(" ")[0]];
            if (!command) {
                command = "browser";
            }
        } catch (e) {
            command = "browser";
        }
        await sleep(750);
        await writeInput(command + " https://localhost/");
        await newLine("", true);
        writing = true;
        await sleep(750);
        showMainSite();
    }


    onMount(async () => {
        await main();
    });

</script>

<style lang="scss">
  @import "../styles/fonts";

  $link-fade-color: #5e5e5e;
  $link-fade-timing: cubic-bezier(.33, .05, .69, .93);

  * {
    font-family: "Source Code Pro", Sans-Serif, serif;
    font-weight: normal;
    font-style: normal;
    box-sizing: border-box;
    overflow: -moz-scrollbars-none !important;
    -ms-overflow-style: none !important;
    margin: 0;
    padding: 0;
  }

  ::-webkit-scrollbar {
    width: 0 !important;
  }

  #terminal {
    position: absolute;
    //overflow-y: scroll;
    color: white;
    white-space: pre-line;
    z-index: 0;
    background-color: black;
    height: 100%;
    width: 100%;
    // Add some padding so the text isn't touching the window frame
    padding: 6px;
  }

  :global(#username) {
    color: #49ec0f;
  }

  :global(#computer) {
    color: #49ec0f;
  }

  :global(#directory) {
    color: #0e7aef;
  }

  .cursor::after {
    content: "█"
  }

  :global(a) {
    color: white;
    transition: color 500ms;
  }

  :global(a:hover) {
    -webkit-animation: link-fade 1s $link-fade-timing infinite;
    -moz-animation: link-fade 1s $link-fade-timing infinite;
    -ms-animation: link-fadelink-fade 1s $link-fade-timing infinite;
    -o-animation: link-fade 1s $link-fade-timing infinite;
    animation: link-fade 1s $link-fade-timing infinite;
  }

  // Shared
  .no-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
  }

  // Animations
  @-webkit-keyframes link-fade {
    0% {
      color: white;
    }
    50% {
      color: $link-fade-color;
    }
    100% {
      color: white;
    }
  }

  @-moz-keyframes link-fade {
    0% {
      color: white;
    }
    50% {
      color: $link-fade-color;
    }
    100% {
      color: white;
    }
  }

  @keyframes link-fade {
    0% {
      color: white;
    }
    50% {
      color: $link-fade-color;
    }
    100% {
      color: white;
    }
  }
</style>