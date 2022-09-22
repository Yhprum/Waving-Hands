import { Server } from "socket.io";

export default function injectSocketIO(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(socket.id);
    io.emit("message", socket.id);
    socket.on("disconnect", () => console.log("disconnected", socket.id));
  });

  console.log("SocketIO injected");
}
