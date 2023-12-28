import express from "express";
import {
  createProject,
  getAllProject,
  getProjectKategori,
  getLastProject,
  updateProject,
  deleteProject,
  getProjectId,
} from "./ControllerProject.js";
import { verifyUser } from "../auth/Middleware.js";

const router = express.Router();

router.post("/project", verifyUser, createProject);
router.get("/project", getAllProject);
router.get("/project/kategori", getProjectKategori);
router.get("/project/last", getLastProject);
router.get("/project/:id", getProjectId);
router.patch("/project/:id", verifyUser, updateProject);
router.delete("/project/:id", verifyUser, deleteProject);

export default router;
