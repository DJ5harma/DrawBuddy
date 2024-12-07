import { io, Socket } from "socket.io-client";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { SOCKET_URL, ENSURE_SOCKET_SERVER_API } from "../utils/apiRoutes";
import axios from "axios";
import toast from "react-hot-toast";

const context = createContext<{
	socket: Socket | null;
	switchSocket: (ON: boolean) => Promise<void>;
}>({
	socket: null,
	switchSocket: () => new Promise((res) => res),
});

export default function SocketProvider({ children }: { children: ReactNode }) {
	const socketRef = useRef(
		io(SOCKET_URL, { autoConnect: false, transports: ["websocket"] })
	);

	const [isConnected, setIsConnected] = useState(false);

	const switchSocket = async (ON: boolean) => {
		if (ON === true && !isConnected) {
			await axios.get(ENSURE_SOCKET_SERVER_API);
			socketRef.current.connect();
		}
		if (ON === false && isConnected) {
			socketRef.current.disconnect();
		}
	};

	useEffect(() => {
		socketRef.current.on("connect", () => {
			toast.success("Socket server connected!");
			setIsConnected(true);
		});

		return () => {
			socketRef.current.disconnect();
		};
	}, []);

	return (
		<context.Provider value={{ socket: socketRef.current, switchSocket }}>
			{children}
		</context.Provider>
	);
}

export const useSocket = () =>
	useContext(context) as {
		socket: Socket;
		switchSocket: (ON: boolean) => Promise<void>;
	};
