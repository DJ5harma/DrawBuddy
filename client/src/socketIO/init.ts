import io, { Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = () => {
	if (!socket) socket = io("ws://localhost:3000");

	return socket;
};
