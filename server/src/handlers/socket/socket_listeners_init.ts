import { io, socketCache } from "../../cache";
import clear_all_elements from "./reactors/clear_all_elements";
import creating_new_element from "./reactors/creating_new_element";
import disconnect from "./reactors/disconnect";
import finalized_new_element from "./reactors/finalized_new_element";
import i_arrived_at_room from "./reactors/i_arrived_at_room";

export default function socket_listeners_init() {
	io.on("connection", (socket) => {
		console.log("clients:", ++socketCache.clients);

		socket.on("i_arrived_at_room", (data) => i_arrived_at_room(socket, data));

		socket.on("creating_new_element", (data) =>
			creating_new_element(socket, data)
		);

		socket.on("finalized_new_element", (data) =>
			finalized_new_element(socket, data)
		);

		socket.on("clear_all_elements", (data) => clear_all_elements(socket, data));

		socket.on("disconnect", () => disconnect(socket));
	});
}
