import { Router } from 'express';
import { readCategories, readCategory, readDesigns, readTailor, readTailors } from '../controllers/catalogue.controller.js';

export const categoryRouter = Router();
categoryRouter.get('/', readCategories);
categoryRouter.get('/:slug', readCategory);

export const designRouter = Router();
designRouter.get('/', readDesigns);

export const directoryTailorRouter = Router();
directoryTailorRouter.get('/', readTailors);
directoryTailorRouter.get('/:id', readTailor);
