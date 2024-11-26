import { Server } from "socket.io";
import { IElement, IPeers } from "./types";
import { CLIENT_URL } from "./constants";

export const roomToUsersMap = new Map<string, IPeers>();
export const useridToRoomMap = new Map<string, string>();
export const roomToElementsMap = new Map<string, IElement[]>();

export const io = new Server({
	cors: { origin: CLIENT_URL },
	pingInterval: 25000,
	pingTimeout: 10000,
});

export const socketCache = {
	closed: true,
	startedToClose: false,
	clients: 0,
};
