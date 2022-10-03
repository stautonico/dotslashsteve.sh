export function main(args: string[]): number {
    let socket = new WebSocket("wss://localhost:8000");

    socket.onopen = function() {
        socket.send("Hello");
    }

    socket.onmessage = function(event) {
        console.log(event.data);
    }

    return 0;
}
