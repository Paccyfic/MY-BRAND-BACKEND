import { Request, Response } from "express";
import dotenv from "dotenv";
import { User } from "../models/user";
import { uploadToCloudinary, uploadOptions } from "../utils/uploads";
import { comparePassword, hashPassword } from "../utils/strings";
import { validateEmail, validatePassword } from "../utils/validations";
import jwt from "jsonwebtoken";
import { UserInterface } from "../middlewares/isAuthenticated";



//const role = User;

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { JWT_SECRET } = process.env;

class UserController {
  // SIGNUP
  static async signup(req: UserInterface, res: Response) {
    try {
      const { name, email, password } = req.body;
      let uploadedImage: string = null;

      // CHECK IF REQUIRED FIELDS ARE NOT EMPTY
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // VALIDATE EMAIL AND PASSWORD
      const emailIsValid = validateEmail(email);
      const passwordIsValid = validatePassword(password);

      if (emailIsValid.error) {
        return res.status(400).json({ message: "Invalid email" });
      }

      if (passwordIsValid.error) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      // CHECK IF USER EXISTS
      const userExists = await User.findOne({ email });

      // IF USER EXISTS
      if (userExists) {
        return res.status(409).json({
          message: `User with email ${email} already exists`,
        });
      }

      
    

        

      // HASH PASSWORD
      const hashedPassword = await hashPassword(password);

      // CREATE USER
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        image: uploadedImage,
        //role,
      });

      // CREATE TOKEN
      const token = jwt.sign(
        { _id: newUser._id, email: newUser?.email, /*role: newUser?.role*/ },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      // RETURN USER
      return res.status(201).json({
        message: "User created successfully",
        data: {
          user: {
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
            _id: newUser._id,
          },
          token,
        },
      });

      // HANDLE ERRORS
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // LOGIN
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // CHECK IF REQUIRED FIELDS ARE NOT EMPTY
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // VALIDATE EMAIL
      const emailIsValid = validateEmail(email);

      if (emailIsValid.error) {
        return res.status(400).json({ message: "Invalid email" });
      }

      // CHECK IF USER EXISTS
      const userExists = await User.findOne({ email }).select("+password");

      // IF USER DOES NOT EXIST
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      // CHECK IF PASSWORD IS CORRECT
      const passwordIsValid = await comparePassword(
        password,
        userExists.password
      );

      // IF PASSWORD IS INCORRECT
      if (!passwordIsValid) {
        return res
          .status(400)
          .json({ message: "Email or password not correct" });
      }

      // GENERATE TOKEN
      const token = jwt.sign(
        {
          _id: userExists._id,
          email: userExists?.email,
          // role: userExists?.role,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      // RETURN RESPONSE
      return res.status(200).json({
        message: "Login successful",
        data: {
          user: {
            name: userExists.name,
            email: userExists.email,
            image: userExists.image,
            _id: userExists._id,
          },
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // LIST ALL USERS
  static async listUsers(req: Request, res: Response) {
    try {
      const users = await User.find().sort('name email createdAt');

      // RETURN USERS
      return res.status(200).json({
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // GET USER DETAILS
  static async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // CHECK IF USER EXISTS
      const userExists = await User.findById(id);

      if (!userExists) {
        return res.status(404).json({ message: `User not found` });
      }

      // RETURN USER
      return res.status(200).json({
        message: "User retrieved successfully",
        data: userExists,
      });

      // HANDLE ERRORS
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // DELETE USER
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // CHECK IF USER EXISTS
      const userExists = await User.findById(id);

      if (!userExists) {
        return res.status(404).json({ message: `User not found` });
      }

      // DELETE USER
      await User.findByIdAndDelete(id);

      // RETURN USER
      return res.status(204).json({ message: "User deleted successfully" });

      // HANDLE ERRORS
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // UPDATE USER
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, image = null, role = "user" } = req.body;

      // CHECK IF USER EXISTS
      const userExists = await User.findById(id);

      if (!userExists) {
        return res.status(404).json({ message: `User not found` });
      }

      let uploadedImage: any = null;

      // IF IMAGE IS PROVIDED
      if (image) {
        const imageUpload = await uploadToCloudinary(image, {
          ...uploadOptions,
          public_id: `my-brand/users/${name}`,
        });

        uploadedImage = imageUpload.secure_url;
      }

      // UPDATE USER
      const updatedUser = await User.findByIdAndUpdate(id, {
        name: name || userExists.name,
        email: email || userExists.email,
        image: uploadedImage || userExists.image,
        /*role: role || userExists.role,*/
      }, {
        new: true
      })

      // RETURN USER
      return res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
      });

      // HANDLE ERRORS
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
