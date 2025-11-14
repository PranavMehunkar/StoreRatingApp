import express from 'express';
import { submitRating, getStoreRatings } from '../controllers/ratingController.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, authorizeRole(['user']), submitRating);
router.get('/owner', verifyToken, authorizeRole(['owner']), getStoreRatings);

export default router;
