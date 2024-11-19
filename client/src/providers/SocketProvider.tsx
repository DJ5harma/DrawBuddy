import { io, Socket } from "socket.io-client";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";

const socketSample = io("localhost:3000", { autoConnect: false });

const context = createContext<{ socket: Socket }>({
	socket: socketSample,
});

export default function SocketProvider({ children }: { children: ReactNode }) {
	const socketRef = useRef(socketSample);

	useEffect(() => {
		const socket = socketRef.current;
		socket.emit("hi");
		return () => {
			socketRef.current.disconnect();
		};
	}, []);
	return (
		<context.Provider value={{ socket: socketRef.current }}>
			{children}
		</context.Provider>
	);
}

export const useSocket = () => useContext(context);
