from websocket_server import WebsocketServer

def new_client(client, server):
    server.send_message(client, "Hello client, say hello!");
    server.send_message_to_all("Hey all, a new client has joined");

def msg_recieved(client, server, message):
    print(f"Message from {client['address'][0]}: {message}")
    server.send_message(client, "ACK")

server = WebsocketServer(host="0.0.0.0", port=8000, key="./keys/key.pem", cert="./keys/cert.pem")
server.set_fn_new_client(new_client)
server.set_fn_message_received(msg_recieved)
server.run_forever()
