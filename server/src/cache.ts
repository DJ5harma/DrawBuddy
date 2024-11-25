import { Server } from "socket.io";

interface IPeers {
	[userid: string]: {
		username: string;
	};
}

export const roomToUsersMap = new Map<string, IPeers>();
export const useridToRoomMap = new Map<string, string>();
export const roomToElementsMap = new Map<string, Object[]>();

export const io = new Server({
	cors: { origin: "http://localhost:5173/" },
	pingInterval: 25000,
	pingTimeout: 10000,
});
export const socketCache = {
	closed: true,
	startedToClose: false,
	clients: 0,
};
