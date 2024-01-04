import express from "express";
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} from "./ControllerUser.js";
import { verifyUser } from "./Middleware.js";

const router = express.Router();

router.post("/user", verifyUser, createUser);
router.get("/user", getUser);
router.get("/user/:id", verifyUser, getUserById);
router.patch("/user/:id", verifyUser, updateUser);
router.delete("/user/:id", verifyUser, deleteUser);

export default router;
