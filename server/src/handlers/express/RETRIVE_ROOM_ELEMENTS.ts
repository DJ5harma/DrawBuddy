import { Router } from "express";
import { roomToElementsMap } from "../../cache";

const router = Router();

router.post("/RETRIVE_ROOM_ELEMENTS", (req, res) => {
	const { roomId } = req.body;

	if (!roomToElementsMap.has(roomId)) roomToElementsMap.set(roomId, new Map());
	const elemMap = roomToElementsMap.get(roomId)!;

	res.status(200).json({ elements: [...elemMap.entries()] });
});

export default router;
