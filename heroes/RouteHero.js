import express from "express";
import {
  createHero,
  getAllHero,
  displayHero,
  deleteHero,
} from "./ControllerHero.js";
import { verifyUser } from "../auth/Middleware.js";

const router = express.Router();

router.post("/hero", verifyUser, createHero);
router.get("/hero", getAllHero);
router.get("/displayhero", displayHero);
router.delete("/hero/:id", verifyUser, deleteHero);

export default router;
