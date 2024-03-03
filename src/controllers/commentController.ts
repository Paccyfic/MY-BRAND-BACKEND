import { Request, Response } from "express";
import dotenv from "dotenv";
import { Comment } from "../models/comment";
import { UserInterface } from "../middlewares/isAuthenticated";
import { Blog } from "../models/blog";

// CONFIGURE DOTENV
dotenv.config();

class commentController {
  // CREATE BLOG COMMENT
  static async createComment(req: UserInterface, res: Response) {
    try {
      const { body, blogId } = req.body;
      const { user } = req;

      // CHECK IF BLOG EXISTS
      const blogExists = await Blog.findById(blogId);

      // IF BLOG DOES NOT EXIST
      if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // CREATE COMMENT
      const comment = await Comment.create({
        body,
        blogId,
        userId: user._id,
      });

      // RETURN RESPONSE
      return res
        .status(201)
        .json({ message: "Comment created successfully", data: comment });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // LIST BLOG COMMENTS
  static async listComments(req: Request, res: Response) {
    try {
      const { blogId } = req.query;

      // CHECK IF BLOG EXISTS
      const blogExists = await Blog.findById(blogId);

      // IF BLOG DOES NOT EXIST
      if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // LIST COMMENTS
      const comments = await Comment.find({ blogId }).populate({
        path: "userId",
        select: "name email image",
      });

      // RETURN RESPONSE
      return res
        .status(200)
        .json({ message: "Comments retrieved successfully", data: comments });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // DELETE BLOG COMMENT
  static async deleteComment(req: UserInterface, res: Response) {
    try {
      const { id } = req.params;
      const { user } = req;

      // CHECK IF USER IS ADMIN
      if (user?.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // CHECK IF COMMENT EXISTS
      const commentExists = await Comment.findById(id);

      // IF COMMENT DOES NOT EXIST
      if (!commentExists) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // DELETE COMMENT
      await Comment.findByIdAndDelete(id);

      // RETURN RESPONSE
      return res.status(204).json({ message: "Comment deleted successfully" });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // GET COMMENT
  static async getComment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // CHECK IF COMMENT EXISTS
      const comment = await Comment.findById(id).populate({
        path: "userId",
        select: "name email image",
      });

      // IF COMMENT DOES NOT EXIST
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // RETURN RESPONSE
      return res
        .status(200)
        .json({ message: "Comment retrieved successfully", data: comment });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default commentController;
