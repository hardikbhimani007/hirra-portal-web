import { io } from "socket.io-client";

const SOCKET_URL = "http://68.183.94.242:5001/";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
