import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RoomHandler() {
	const { id } = useParams();
	useEffect(() => {
		console.log(id);
	}, []);
	return null;
}
