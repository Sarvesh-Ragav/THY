import type { RequestHandler } from 'express';
import { catalogueQuerySchema, categorySlugSchema, tailorDirectoryQuerySchema, tailorPublicIdSchema } from '../validators/catalogue.schemas.js';
import { getCategory, getTailor, listCategories, listDesigns, listTailors } from '../services/catalogue.service.js';

export const readCategories: RequestHandler = async (_request, response, next) => { try { response.json({ success: true, data: { categories: await listCategories() } }); } catch (error) { next(error); } };
export const readCategory: RequestHandler = async (request, response, next) => { try { const { slug } = categorySlugSchema.parse(request.params); response.json({ success: true, data: { category: await getCategory(slug) } }); } catch (error) { next(error); } };
export const readDesigns: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: await listDesigns(catalogueQuerySchema.parse(request.query)) }); } catch (error) { next(error); } };
export const readTailors: RequestHandler = async (request, response, next) => { try { response.json({ success: true, data: await listTailors(tailorDirectoryQuerySchema.parse(request.query)) }); } catch (error) { next(error); } };
export const readTailor: RequestHandler = async (request, response, next) => { try { const { id } = tailorPublicIdSchema.parse(request.params); response.json({ success: true, data: { tailor: await getTailor(id) } }); } catch (error) { next(error); } };
