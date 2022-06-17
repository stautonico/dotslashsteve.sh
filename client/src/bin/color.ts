import {print}  from "../helpers/io";
export function main(args: string[]) {
    if (args.length < 2) {
        print(`usage: color [fg/bg] [color]`, true);
        return;
    }

    if (args[0] === "fg" || args[0] === "fore" || args[0] === "foreground") {
        document.body.style.color = args[1];
    } else {
        document.body.style.backgroundColor = args[1];
    }
}