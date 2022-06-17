import {print}  from "../helpers/io";
export function main(args: string[]) {
    if (args.length < 1) {
        print(`usage: tempperfcolor [color]`, true);
        return;
    }

    // @ts-ignore
    document.querySelector(":root").style.setProperty("--term-blue", args[0]);

}