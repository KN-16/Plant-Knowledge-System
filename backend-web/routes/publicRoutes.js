import express from 'express';
import { getHomeData, getVarietyDetail , getPublicVarietiesList, 
    getCompareVarieties, getTaxonomyTree, incrementViewCount,
    checkHealth } from '../controllers/publicController.js';
const router = express.Router();

router.get('/home-data', getHomeData);
router.get('/varieties', getPublicVarietiesList);
router.post('/varieties/compare', getCompareVarieties);
router.get('/taxonomy-tree', getTaxonomyTree);
router.get('/health', checkHealth);
router.get('/varieties/:id', getVarietyDetail);
router.post('/varieties/:id/view', incrementViewCount);

export default router;