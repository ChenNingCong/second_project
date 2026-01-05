import { loadEnv } from './env/utils.js';
loadEnv(".unauth.env")
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import createApp from '../src/app.js';
import { createDB } from './fixture/db.js';
import { ProductBrand, ProductType } from '../src/models/Product.js';

const db = await createDB(process.env);
const app = createApp();
afterAll(async () => { await db.disconnect() })

describe('Product Controller - Supertest Integration', async () => {
    const brandRecord = await ProductBrand.findOne();
    const typeRecord = await ProductType.findOne();

    if (!brandRecord || !typeRecord) {
        throw new Error("DATABASE EMPTY: Please ensure your DB has brands and types before running tests.");
    }

    const realBrandName = brandRecord.name;
    const realTypeName = typeRecord.name;
    it('GET /products - should return 200 and products for a valid brand', async () => {
        const response = await request(app)
            .get('/api/products')
            .query({ brand: realBrandName, page: 1 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.products)).toBe(true);
        expect(response.body.data.products.length > 0).toBe(true);
    });

    it('GET /products - should return 422 if queryValidator fails (e.g., page is string)', async () => {
        const response = await request(app)
            .get('/api/products')
            .query({ page: 'not-a-number' });

        expect(response.status).toBe(422);
    });

    it('GET /products - should return 422 if the page number is too large', async () => {
        const response = await request(app)
            .get('/api/products')
            .query({ page: 1000000000 });

        expect(response.status).toBe(422);
        expect(response.body.error).include("Max page")
        
    });

    it('GET /products - should return error for non-existent brand', async () => {
        let response = await request(app)
            .get('/api/products')
            .query({ brand: 'ImaginaryBrand_999_really_fake' });
        expect(response.status).toBe(422);
        expect(response.body.error).toBe('One or more selected brands are invalid.');

        response =  await request(app)
            .get('/api/products')
            .query({ type: 'ImaginaryType_999_really_fake' });
        expect(response.status).toBe(422);
        expect(response.body.error).toBe('One or more selected types are invalid.');
    });

    it('GET /products - should apply default sorting (newest)', async () => {
        const response = await request(app)
            .get('/api/products')
            .query({ page: 1 });

        expect(response.status).toBe(200);
        expect(response.body.data.pagination.currentPage).toBe(1);
    });
});