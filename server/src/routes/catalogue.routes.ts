import { Router } from 'express';
import { readCategories, readCategory, readDesigns, readKurtiDesigns, readTailor, readTailors } from '../controllers/catalogue.controller.js';

export const categoryRouter = Router();
categoryRouter.get('/', readCategories);
categoryRouter.get('/:slug', readCategory);

export const designRouter = Router();
designRouter.get('/', readDesigns);
designRouter.get('/kurtis', readKurtiDesigns);

export const directoryTailorRouter = Router();
directoryTailorRouter.get('/', readTailors);
directoryTailorRouter.get('/:id', readTailor);
