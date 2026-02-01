import express from 'express';
import * as taxController from '../controllers/taxonomyController.js';
import {requireRole } from '../middleware/roleMiddleware.js';
import { requireAuth} from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Taxonomy CRUD (families, genera, species)

// Post genera
router.post('/genera', taxController.createGenus);
// Put genera
router.put('/genera/:id', taxController.updateGenus);

// GET list
router.get('/:type', taxController.getList);
// GET search for select
router.get('/:type/search', taxController.searchForSelect);
// POST create
router.post('/:type', requireAuth, requireRole('admin'), taxController.createItem);
// PUT update
router.put('/:type/:id', requireAuth, requireRole('admin'), taxController.updateItem);
// DELETE
router.delete('/:type/:id', requireAuth, requireRole('admin'), taxController.deleteItem);
// Fetch list without pagination
router.get('/:type/all', taxController.fetchAllItems);

// Import Excel
router.post('/:type/import', requireAuth, requireRole('admin'), upload.single('file'), taxController.importExcel);

export default router;