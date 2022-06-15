import {Computer} from "../../src/computer.js";

let computer: Computer;

beforeEach(() => {
    computer = new Computer("dotslashsteve.sh");
});

test("read: successful read", () => {
    console.log(computer.sys$geteuid());
});