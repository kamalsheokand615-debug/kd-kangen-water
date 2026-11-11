import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { uploadArray } from '../middleware/upload.js';
import * as ctrl from '../controllers/index.js';

const router = Router();

// Public product routes
router.get('/', ctrl.getPublicProducts);
router.get('/:slug', ctrl.getPublicProduct);

// Admin product routes (protected)
router.use('/admin', authMiddleware);
router.get('/admin', ctrl.adminGetProducts);
router.get('/admin/:id', ctrl.adminGetProduct);
router.post('/admin', uploadArray('images', 10), ctrl.adminCreateProduct);
router.put('/admin/:id', uploadArray('images', 10), ctrl.adminUpdateProduct);
router.delete('/admin/:id', ctrl.adminDeleteProduct);

export default router;