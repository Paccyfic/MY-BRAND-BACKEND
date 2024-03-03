import express, { Router} from 'express';
import userRoutes from './userRoutes';
import blogRoutes from './blogRoutes';
import commentRoutes from './commentRoutes';

const router: Router = express.Router();

router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);

export default router;
