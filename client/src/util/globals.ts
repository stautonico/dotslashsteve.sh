import {OutputBuffer} from "./buffer";
import {Computer} from "../computer";


export var OUTPUT_FRAME = document.getElementById("text-content");
export var CURSOR = document.getElementById("cursor");
export var OUTPUT_BUFFER: OutputBuffer = new OutputBuffer();
export var computer = new Computer("dotslashsteve.sh");
await computer.init();
export var PASS_THROUGH_INDICATOR = document.getElementById("passthrough-mode");


// Some misc global settings go here
export var SETTINGS = {
    debug: true
}
