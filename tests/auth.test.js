import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

// Load env in a setup file or at the top as you did before
import { configDotenv } from 'dotenv';
import { createDB } from './fixture/db.js';
configDotenv({ path: '../env/.auth.env' });
const db = await createDB(process.env);
afterAll(async ()=>{await db.disconnect()})

describe('Authentication & Protected Content Integration', () => {
    const validUser = {
        username: 'testcoder',
        email: 'test@example.com',
        password: 'password123'
    };

    describe('Registration Flow', () => {
        it('should block invalid input (short password, bad email)', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ username: '', email: 'not-an-email', password: '123' });

            expect(res.statusCode).toBe(422);

            // Vitest uses the same 'expect' syntax as Jest
            // expect(res.body.errors).toEqual(
            //     expect.arrayContaining([
            //         expect.objectContaining({ msg: 'Username is required' }),
            //         expect.objectContaining({ msg: 'Please provide a valid email' }),
            //         expect.objectContaining({ msg: 'Password must be at least 6 characters long' })
            //     ])
            // );
        });

        it('should register a user and block duplicate emails', async () => {
            await request(app).post('/api/register').send(validUser);

            const res = await request(app).post('/api/register').send(validUser);

            expect(res.statusCode).toBe(422);
            // expect(res.body.errors[0].msg).toBe('E-mail already in use');
        });
    });

    describe('Login & Access Control', () => {
        it('should block unauthorized access to the products list', async () => {
            const res = await request(app).get('/api/products');
            console.log(res)
            expect(res.statusCode).toBe(302);
            // expect(res.body.error).toBe('Unauthorized');
        });

        it('should allow access to products after a successful login', async () => {
            // Mocking or Creating user
            // await User.create(validUser);
            const agent = request.agent(app);

            const loginRes = await agent
                .post('/api/login')
                .send({ email: validUser.email, password: validUser.password });

            expect(loginRes.statusCode).toBe(200);
            expect(loginRes.body.message).toBe('Login successful');

            const productRes = await agent.get('/api/products');

            expect(productRes.statusCode).toBe(200);
            // expect(Array.isArray(productRes.body)).toBe(true);
            // console.log(productRes.body)
            // expect(productRes.body).toContain('Computer');
        });
    });
});
