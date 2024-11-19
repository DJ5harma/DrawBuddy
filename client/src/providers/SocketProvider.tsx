import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const context = createContext<{ socket: Socket | null }>({
	socket: null,
});

export default function SocketProvider({ children }: { children: ReactNode }) {
	const socketRef = useRef(io("localhost:3000"));

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

export const useSocket = () => useContext(context) as { socket: Socket };
