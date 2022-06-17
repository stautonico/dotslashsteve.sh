import {print}  from "../helpers/io";
import {computer} from "../helpers/globals";

export function main(args: string[]) {
    if (args.length < 1) {
        print(`usage: edit [path]`, true);
        return;
    }

    const path = args[0];
    const file = computer.find(path);
    if (file.fail()) {
        print(`Could not find file ${path}`, true);
        return;
    }

    // Open a new iframe with "edit.html" as the source
    const iframe = document.createElement("iframe");
    iframe.src = "edit.html";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.zIndex = "1";
    document.body.appendChild(iframe);

    // Send a message to the iframe to set the file to edit
    const message = {
        type: "set_file",
        // @ts-ignore
        data: file.get_data().get_content()
    };

    // Wait for the iframe to load, and then send the message
    iframe.onload = () => {
        iframe.contentWindow!.postMessage(message, "*");
    }

    // Wait for the iframe to send a message back to us
    window.addEventListener("message", (event) => {
        if (event.data.type === "save_file") {
            // @ts-ignore
            file.get_data().write(event.data.data);
            // Remove the iframe
            document.body.removeChild(iframe);
            // Remove the event listener
            window.removeEventListener("message", (event) => {});
        }
    });
}
