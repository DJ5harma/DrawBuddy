import { Router } from "express";
import { roomToElementsMap } from "../../cache";

const router = Router();

router.post("/RETRIVE_ROOM_ELEMENTS", (req, res) => {
	const { roomId } = req.body;
	const elements = roomToElementsMap.get(roomId) || [];
	if (!elements.length) roomToElementsMap.set(roomId, []);
	res.status(200).json({ elements });
});
export default router;
