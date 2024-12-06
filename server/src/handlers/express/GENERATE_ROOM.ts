import { randomUUID } from "crypto";
import { Router } from "express";

const router = Router();

router.get("/GENERATE_ROOM", (_, res) => {
	res.status(200).json({ roomId: randomUUID() });
});

export default router;
