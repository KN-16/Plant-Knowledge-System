import express from 'express';
import * as taxController from '../controllers/taxonomyController.js';
import * as varController from '../controllers/varietyController.js';
import {requireRole } from '../middleware/roleMiddleware.js';
import { requireAuth} from '../middleware/authMiddleware.js';
import { uploadToDisk } from '../middleware/uploadMiddleware.js';
import { cleanupUploadedFilesOnError} from '../middleware/errorMiddleware.js';

const router = express.Router();

// Taxonomy CRUD (families, genera, species)

// Post genera
router.post('/genera', requireAuth, taxController.createGenus);
// Put genera
router.put('/genera/:id', requireAuth, taxController.updateGenus);
// Post species
router.post('/species', requireAuth, taxController.createSpecies);
// Put species
router.put('/species/:id', requireAuth, taxController.updateSpecies);


// Variety CRUD

// Lấy options cho các trường enum để frontend dễ render form
router.get('/varieties/ui-options', varController.mapUIViewData);

// GET list
router.get('/varieties', varController.getVarieties);
router.get('/varieties/provinces', varController.getProvinces);
router.post('/varieties', requireAuth, uploadToDisk.array('images', 20), varController.saveVariety, cleanupUploadedFilesOnError);

// Tạo mới hoặc Sửa: Hứng nhiều file với field name là 'images'
router.get('/varieties/:id', varController.getVarietyDetail);
router.put('/varieties/:id', requireAuth, uploadToDisk.array('images', 20), varController.saveVariety, cleanupUploadedFilesOnError);
router.delete('/varieties/:id', requireAuth, varController.deleteVariety);
// Get provinces for distribution tab



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

// // Import Excel
// router.post('/:type/import', requireAuth, requireRole('admin'), upload.single('file'), taxController.importExcel);

export default router;