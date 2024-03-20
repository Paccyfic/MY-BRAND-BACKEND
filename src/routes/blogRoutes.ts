import express, { Router } from "express";
import BlogController from "../controllers/blogController";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated";

const router: Router = express.Router();

// CREATE BLOG
router.post("/createNewBlog", isAuthenticated, isAdmin, BlogController.createBlog);

// LIST BLOGS
router.get("/", BlogController.listBlogs);

// GET BLOG
router.get("/:id", BlogController.getBlog);

// DELETE BLOG
router.delete("/:id", isAuthenticated, isAdmin, BlogController.deleteBlog);

// UPDATE BLOG
router.patch("/:id", isAuthenticated, isAdmin, BlogController.updateBlog);

// LIKE BLOG
router.post("/:id/like", isAuthenticated, BlogController.likeBlog);

// UNLIKE BLOG
router.post("/:id/unlike", isAuthenticated, BlogController.unlikeBlog);

// COUNT LIKES
router.get("/:id/likes", BlogController.countLikes);

export default router;
