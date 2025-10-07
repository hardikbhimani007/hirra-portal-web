import { io } from "socket.io-client";

const SOCKET_URL = "https://002b7c7p-5000.inc1.devtunnels.ms/";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
