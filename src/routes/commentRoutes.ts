import express, { Router } from "express";
import commentController from "../controllers/commentController";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated";

const router: Router = express.Router();

// CREATE COMMENT
router.post("/", isAuthenticated, commentController.createComment);

// LIST COMMENTS
router.get("/", commentController.listComments);

// GET COMMENT
router.get("/:id/", commentController.getComment);

// DELETE COMMENT
router.delete("/:id", isAuthenticated, isAdmin, commentController.deleteComment);

export default router;