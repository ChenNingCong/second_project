import { configDotenv } from 'dotenv';
// use an authorized environment
configDotenv({ path: '../env/.auth.env' })

import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Authentication & Protected Content Integration', () => {
    const validUser = {
        username: 'testcoder',
        email: 'test@example.com',
        password: 'password123'
    };

    // --- SECTION 1: REGISTRATION & VALIDATION ---
    describe('Registration Flow', () => {
        it('should block invalid input (short password, bad email)', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ username: '', email: 'not-an-email', password: '123' });

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: 'Username is required' }),
                    expect.objectContaining({ msg: 'Please provide a valid email' }),
                    expect.objectContaining({ msg: 'Password must be at least 6 characters long' })
                ])
            );
        });

        it('should register a user and block duplicate emails', async () => {
            // First registration
            await request(app).post('/api/register').send(validUser);
            
            // Duplicate attempt
            const res = await request(app).post('/api/register').send(validUser);
            
            expect(res.statusCode).toBe(400);
            expect(res.body.errors[0].msg).toBe('E-mail already in use');
        });
    });

    // --- SECTION 2: LOGIN & PROTECTED PAGES ---
    describe('Login & Access Control', () => {
        it('should block unauthorized access to the products list', async () => {
            const res = await request(app).get('/api/products');
            
            // Should be blocked by your checkAuthenticated middleware
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        it('should allow access to products after a successful login', async () => {
            // 1. Create the user in the DB
            await User.create(validUser);

            // 2. Use an Agent to persist the session cookie
            const agent = request.agent(app);

            const loginRes = await agent
                .post('/api/login')
                .send({ email: validUser.email, password: validUser.password });

            expect(loginRes.statusCode).toBe(200);
            expect(loginRes.body.message).toBe('Login successful');

            // 3. Request protected page using the same agent
            const productRes = await agent.get('/api/products');

            expect(productRes.statusCode).toBe(200);
            expect(Array.isArray(productRes.body)).toBe(true);
            expect(productRes.body).toContain('Laptop'); // Matches your array logic
        });

        it('should return 401 for valid email but wrong password', async () => {
            await User.create(validUser);

            const res = await request(app)
                .post('/api/login')
                .send({ email: validUser.email, password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Invalid credentials');
        });
    });
});