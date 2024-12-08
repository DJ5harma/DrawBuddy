import { Server } from "socket.io";
import { IElementsMap, IPeers } from "./utils/types";

export const roomToUsersMap = new Map<string, IPeers>();

export const useridToRoomMap = new Map<string, string>();

export const roomToElementsMap = new Map<string, IElementsMap>();

export const io = new Server({
	cors: { origin: "*" },
	pingInterval: 25000,
	pingTimeout: 10000,
});

export const socketCache = {
	closed: true,
	startedToClose: false,
	clients: 0,
};
