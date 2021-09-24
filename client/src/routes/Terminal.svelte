<div>
    <div id="terminal" class="noselect" class:cursor={cursor}>
        {@html currentString}
    </div>
</div>

<style lang="less">
  @import "../assets/styles/fonts";

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
</style>

<script lang="ts">
    import {onMount} from "svelte";

    const COMPUTERS = ["skynet", "hp3000", "hal9000", "wopr", "GlaDOS", "joshua", "alpha60", "localhost"];

    const CURRENT_COMPUTER_NAME = COMPUTERS[Math.floor(Math.random() * COMPUTERS.length)];

    let currentDir = "~";

    let prompt = `<span id="username">steve</span>@<span id="computer">${CURRENT_COMPUTER_NAME}</span>:<span id="directory">${currentDir}</span>$ `;

    let currentString = prompt;

    let cursor = false;
    let allowInput = false;
    let writing = false;

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

    // Helper functions
    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function addString(text: string) {
        currentString += text;
        await sleep(getRandomInt(40, 80));
    }

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

    async function main() {
        await sleep(1000);
        await writeInput("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");
    }

    onMount(async () => {
        await main();
    });

</script>