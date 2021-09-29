<div>
    <div id="terminal" class="no-select" class:cursor={cursor}>
        {@html currentString}
    </div>
</div>

<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";

    const dispatch = createEventDispatcher();

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
        return new Promise<void>(async (resolve) => {
            if (!url) {
                url = toWrite;
            }
            // Write the beginning of the url
            currentString += `<a href='${url}' target="_blank">`

            for (let i = 0; i < toWrite.length; i++) {
                // Try to remove the link ending
                // We do this at the beginning so it stays as a link at the end of the input
                // const lastChar = currentString.substring(currentString.length - "</a>".length)
                // if (lastChar === "</a>") {
                //     currentString = currentString.slice(0, -"</a>".length);
                // }

                await addString(toWrite[i]);
            }
            // Add the link ending
            currentString += "</a>";
            resolve();
        });
    }

    // Simulates output from the binary
    async function writeOutput(toWrite: string, newline = true) {
        return new Promise<void>(async (resolve) => {
            if (newline) {
                // currentString = currentString + "<br />" + toWrite;
                currentString += "<br />" + toWrite;
            } else {
                currentString += toWrite;
            }
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
        writing = true;
        await writeOutput("Cloning into 'dotslashsteve.sh'...");
        await sleep(50);
        await writeOutput("remote: Enumerating objects: 83, done.");
        await sleep(50);
        await writeOutput("remote: Counting objects: 100% (83/83), done.");
        await sleep(50);
        await writeOutput("remote: Compressing objects: 100% (75/75), done.");
        await sleep(50);
        await writeOutput("remote: Total 83 (delta 11), reused 68 (delta 0), pack-reused 0");
        await sleep(50);
        await writeOutput("Receiving objects: 100% (83/83), 392.45 KiB | 5.45 MiB/s, done.");
        await sleep(50);
        await writeOutput("Resolving deltas: 100% (11/11), done.");
        await sleep(50);
        newLine()
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
        await sleep(350);
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