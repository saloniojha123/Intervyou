import { Router } from "express";
import { startInterview, submitTurn, endInterview } from "../controllers/interview.controller.js";

const router = Router();

router.post("/start", startInterview);
router.post("/:sessionId/turn", submitTurn);
router.post("/:sessionId/end", endInterview);

export default router;
