import { Router } from "express";

const router = Router();

// TODO: implement real signup/login with bcrypt + JWT (see User model).
router.post("/signup", (req, res) => {
  res.status(501).json({ error: "Not implemented yet" });
});

router.post("/login", (req, res) => {
  res.status(501).json({ error: "Not implemented yet" });
});

export default router;
