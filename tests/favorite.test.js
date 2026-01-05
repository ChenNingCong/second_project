import { loadEnv } from './env/utils.js';
loadEnv(".unauth.env"); // Ensure you use the correct env for testing
import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import request from 'supertest';
import createApp from '../src/app.js';
import { createDB } from './fixture/db.js';
import { User } from '../src/models/User.js';
import { Product } from '../src/models/Product.js';

const db = await createDB(process.env);
const app = createApp();

afterAll(async () => { 
    await db.disconnect(); 
});

describe('Favorites Controller', () => {
    let testUser;
    let testProduct;
    let agent;

    beforeAll(async () => {
        testUser = await User.findOne()

        testProduct = await Product.findOne();
        if (!testProduct) {
            throw new Error("DATABASE EMPTY: Please ensure your DB has products before running tests.");
        }
        agent = request.agent(app);
    });

    describe('POST /api/favorites/:productId', () => {
        it('should add a product to favorites successfully', async () => {
            const response = await agent
                .post(`/api/favorites/${testProduct._id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.message).toBe("Added to favorites");

            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.favorites).toContainEqual(testProduct._id);
        });

        it('should return 422 if item is already in favorites', async () => {
            const response = await agent
                .post(`/api/favorites/${testProduct._id}`);
            expect(response.status).toBe(422); // Assuming ValidationError maps to 422
            expect(response.body.error).toContain("already in your favorites list");
        });

        it('should return 422 if the product does not exist', async () => {
            const fakeId = "60d5ecb848e6a2f74c8b4567"; // Valid format, non-existent ID
            const response = await agent
                .post(`/api/favorites/${fakeId}`);

            expect(response.status).toBe(422);
            expect(response.body.error).toContain("does not exist");
        });
    });

    describe('GET /api/favorites', () => {
        it('should return the list of favorite products populated with titles', async () => {
            const response = await agent.get('/api/favorites');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0]).toHaveProperty('title');
        });
    });

    describe('DELETE /api/favorites/:productId', () => {
        it('should remove a product from favorites successfully', async () => {
            const response = await agent
                .delete(`/api/favorites/${testProduct._id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.message).toBe("Removed from favorites");

            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.favorites).not.toContainEqual(testProduct._id);
        });

        it('should return 422 if trying to remove an item not in favorites', async () => {
            const response = await agent
                .delete(`/api/favorites/${testProduct._id}`);

            expect(response.status).toBe(422);
            expect(response.body.error).toContain("not found in your favorites list");
        });
    });
});