import express from 'express';
import { addStore, getStores } from '../controllers/storeController.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, authorizeRole(['admin']), addStore);
router.get('/', verifyToken, getStores);

export default router;
