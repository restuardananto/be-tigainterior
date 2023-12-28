import express from "express";
import {
  createSocial,
  allSocial,
  getSocial,
  deleteSocial,
  updateSocial,
} from "./ControllerSocial.js";
import { verifyUser } from "../auth/Middleware.js";

const router = express.Router();

router.post("/social", verifyUser, createSocial);
router.get("/social", verifyUser, allSocial);
router.get("/social/:media", getSocial);
router.patch("/social/:id", verifyUser, updateSocial);
router.delete("/social/:id", verifyUser, deleteSocial);

export default router;
