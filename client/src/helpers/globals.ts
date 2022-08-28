import {Computer} from "../computer";

export var OUTPUT_FRAME = document.getElementById("text-content");
export var CURSOR = document.getElementById("cursor");
export var output_buffer: string[][] = [];
export var computer = new Computer("dotslashsteve.sh");