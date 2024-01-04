import express from "express";
import {
  createPromo,
  getAllPromo,
  displayPromo,
  deletePromo,
} from "./ControllerPromo.js";
import { verifyUser } from "../auth/Middleware.js";

const router = express.Router();

router.post("/promo", verifyUser, createPromo);
router.get("/promo", verifyUser, getAllPromo);
router.get("/displaypromo", displayPromo);
router.delete("/promo/:id", verifyUser, deletePromo);

export default router;
