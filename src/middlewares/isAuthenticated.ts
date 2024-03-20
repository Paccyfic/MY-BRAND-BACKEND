import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user";

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { JWT_SECRET } = process.env;

// ADD USER INTERFACE
// USER INTERFACE
export interface UserInterface extends Request {
  user: any;
  file: any;
}

export const isAuthenticated = (req: UserInterface, res: Response, next) => {
   const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const isAdmin = (req: UserInterface, res: Response, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
