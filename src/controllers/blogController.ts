import { Request, Response } from "express";
import dotenv from "dotenv";
import { Blog } from "../models/blog";
import { Like } from "../models/likes";
import { Comment } from "../models/comment";
import { UserInterface } from "../middlewares/isAuthenticated";
import { createSlug } from "../utils/strings";
import { uploadToCloudinary, uploadOptions } from "../utils/uploads";


// CONFIGURE DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { JWT_SECRET } = process.env;

class blogController {
  static getBlogById(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
      throw new Error("Method not implemented.");
  }
  static getAllBlogs(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
      throw new Error("Method not implemented.");
  }
  // CREATE BLOG
  static async createBlog(req: UserInterface, res: Response) {
    try {
      console.log('Reached createBlog endpoint');
      const { title, body, image = null } = req.body;
      const { user } = req;

      // IF USER IS NOT ADMIN
      //if (user?.role !== "admin") {
      //  return res.status(401).json({ message: "Unauthorized" });
      //}

      // CHECK IF REQUIRED FIELDS ARE NOT EMPTY
      if (!title || !body || !image) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // CREATE SLUG
      const slug = createSlug(title);

      // UPLOAD IMAGE
      const uploadedImage = await uploadToCloudinary(image, {
        ...uploadOptions,
        public_id: `my-brand/blogs/${slug}`,
      });

      // CREATE BLOG
      const blog = await Blog.create({
        title,
        body,
        image: uploadedImage.secure_url,
        slug,
        userId: user._id,
      });

      // RETURN RESPONSE
      return res
        .status(201)
        .json({ message: "Blog created successfully", data: blog });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
 
  
  static async listBlogs(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const blogs = await Blog.find().sort({ createAt: -1 }).populate({
        path: "userId",
        select: "name email image",
      });

      // RETURN RESPONSE
      return res.status(200).json({ message: "Blogs retrieved successfully", data: blogs });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // GET BLOG
  static async getBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { slug } = req.query;

      // IF ID AND SLUG ARE NOT PROVIDED
      if (!id && !slug) {
        return res.status(400).json({ message: "Blog id or slug required" });
      }

      // IF SLUG IS PROVIDED
      if (slug) {
        const blog = await Blog.findOne
        ({ slug: slug as string }).populate({
          path: "userId",
          select: "name email image",
        });

        // IF BLOG DOES NOT EXIST
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }

        // RETURN RESPONSE
        return res
          .status(200)
          .json({ message: "Blog retrieved successfully", data: blog });
      }

      const blog = await Blog.findById(id).populate({
        path: "userId",
        select: "name email image",
      });

      // IF BLOG DOES NOT EXIST
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // RETURN RESPONSE
      return res
        .status(200)
        .json({ message: "Blog retrieved successfully", data: blog });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // DELETE BLOG
  static async deleteBlog(req: UserInterface, res: Response) {
    try {
      const { id } = req.params;
      const { user } = req;

      // IF USER IS NOT ADMIN
      if (user?.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // DELETE BLOG
      const blog = await Blog.findByIdAndDelete(id);

      // IF BLOG DOES NOT EXIST
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // RETURN RESPONSE
      return res.status(204).json({ message: "Blog deleted successfully" });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // UPDATE BLOG
  static async updateBlog(req: UserInterface, res: Response) {
    try {
      const { id } = req.params;
      const { user } = req;
      const { title, body, image = null } = req.body;

      // IF USER IS NOT ADMIN
      if (user?.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // CHECK IF BLOG EXISTS
      const blogExists = await Blog.findById(id);

      // IF BLOG DOES NOT EXIST
      if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // INITIALIZE SLUG AND IMAGE 
      const slug = createSlug(title || blogExists.title);
      let uploadedImage: any = null;

      // UPLOAD IMAGE
      if (image) {
        const imageUpload = await uploadToCloudinary(image, {
          ...uploadOptions,
          public_id: `my-brand/blogs/${slug}`,
        });
        uploadedImage = imageUpload.secure_url;
      }

      // UPDATE BLOG
      const blog = await Blog.findByIdAndUpdate(
        id,
        {
          title: title || blogExists.title,
          body: body || blogExists.body,
          image: uploadedImage?.secure_url || blogExists?.image,
          slug,
          userId: user._id,
        },
        { new: true }
      );

      // RETURN RESPONSE
      return res
        .status(200)
        .json({ message: "Blog updated successfully", data: blog });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // LIKE BLOG
  static async likeBlog(req: UserInterface, res: Response) {
    try {
      const { id } = req.params;
      const { user } = req;

      // CHECK IF BLOG EXISTS
      const blogExists = await Blog.findById(id);

      // IF BLOG DOES NOT EXIST
      if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // CHECK IF USER HAS LIKED BLOG
      const likeExists = await Like.findOne
      ({ blogId: id, userId: user._id });

      // IF USER HAS LIKED BLOG
      if (likeExists) {
        return res.status(409).json({ message: "Blog already liked" });
      }

      // LIKE BLOG
      const likeBlog = await Like.create({
        blogId: id,
        userId: user._id,
      });

      // RETURN RESPONSE
      return res
        .status(200)
        .json({ message: "Liked!", data: likeBlog });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // UNLIKE BLOG
  static async unlikeBlog(req: UserInterface, res: Response) {
    try {
      const { id } = req.params;
      const { user } = req;

      // CHECK IF BLOG EXISTS
      const blogExists = await Blog.findById(id);

      // IF BLOG DOES NOT EXIST
      if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // CHECK IF USER HAS LIKED BLOG
      const likeExists = await Like.findOne
      ({ blogId: id, userId: user._id });

      // IF USER HAS NOT LIKED BLOG
      if (!likeExists) {
        return res.status(404).json({ message: "User has not liked the blog" });
      }

      // UNLIKE BLOG
      await Like.findOneAndDelete({ blogId: id, userId: user._id });

      // RETURN RESPONSE
      return res.status(200).json({ message: "Blog unliked!" });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // COUNT LIKES
  static async countLikes(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // CHECK IF BLOG EXISTS
      const blogExists = await Blog.findById(id);

      // IF BLOG DOES NOT EXIST
      if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // COUNT LIKES
      const likes = await Like.find({ blogId: id }).countDocuments();

      // RETURN RESPONSE
      return res
        .status(200)
        .json({ message: "Likes counted successfully", data: likes });

      // CATCH ERROR
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

}
export default blogController;
