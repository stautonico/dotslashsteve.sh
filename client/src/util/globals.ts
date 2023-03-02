import {OutputBuffer} from "./buffer";
import {Computer} from "../computer";

export var OUTPUT_FRAME = document.getElementById("text-content");
export var CURSOR = document.getElementById("cursor");
export var OUTPUT_BUFFER: OutputBuffer = new OutputBuffer();
export var computer = new Computer(window.location.hostname);
await computer.init();
export var PASS_THROUGH_INDICATOR = document.getElementById("passthrough-mode");

export var FORMATTING_COUNTER = 0;

export function incrementFormattingCounter() {
    FORMATTING_COUNTER++;
}

export function decrementFormattingCounter() {
    FORMATTING_COUNTER--;
}

export function resetFormattingCounter() {
    FORMATTING_COUNTER = 0;
}

// Some misc global settings go here
export var SETTINGS = {
    debug: false,
};
