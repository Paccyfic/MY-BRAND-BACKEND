import express, { Router } from "express";
import UserController from "../controllers/userController";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated";

const router: Router = express.Router();

// SIGNUP
router.post('/signup', UserController.signup);

// LOGIN USER
router.post('/login', UserController.login);

// LIST USERS
router.get('/', isAuthenticated, isAdmin, UserController.listUsers);

// GET USER
router.get('/:id', isAuthenticated, UserController.getUser);

// DELETE USER
router.delete('/:id', isAuthenticated, isAdmin, UserController.deleteUser);

// UPDATE USER
router.patch('/:id', isAuthenticated, UserController.updateUser);

export default router;
