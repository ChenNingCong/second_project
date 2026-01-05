import { loadEnv } from './env/utils.js';
loadEnv(".auth.env")
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import createApp from '../src/app.js';
import { User } from '../src/models/User.js';
import { createDB } from './fixture/db.js';

const db = await createDB(process.env);
const app = createApp();
afterAll(async ()=>{await db.disconnect()})

describe('Authentication & Protected Content', () => {
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
            expect(res.body.error).toContain('username')
            expect(res.body.error).toContain('email')
            expect(res.body.error).toContain('password')
        });

        it('should register a new user', async () => {
            let res = await request(app).post('/api/register').send(validUser);
            expect(res.statusCode).toBe(201);
        });

        it('should register a user and block duplicate emails', async () => {
            const res = await request(app).post('/api/register').send(validUser);

            expect(res.statusCode).toBe(409);
            expect(res.body.error).toContain('username')
            expect(res.body.error).toContain('email')
        });
    });

    describe('Login & Access Control', () => {
        it('should block unauthorized access to the products list', async () => {
            const res = await request(app).get('/api/products');
            // generate a redirection request if it's unauthorized access
            expect(res.statusCode).toBe(401);
        });

        it('should allow access to products after a successful login', async () => {
            // we didn't reset the database here
            const agent = request.agent(app);

            const loginRes = await agent
                .post('/api/login')
                .send({ email: validUser.email, password: validUser.password });

            expect(loginRes.statusCode).toBe(200);
            expect(loginRes.body.data.message).toBe('Login successful');

            const productRes = await agent.get('/api/products');

            expect(productRes.statusCode).toBe(200);
            // expect(Array.isArray(productRes.body)).toBe(true);
            // console.log(productRes.body)
            // expect(productRes.body).toContain('Computer');
        });
    });
});
