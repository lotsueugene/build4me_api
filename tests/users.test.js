const request = require('supertest');
const express = require('express');
const { db, User } = require('../database/index');
const usersRouter = require('../routes/api/users');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

beforeAll(async () => {
    await db.sync({ force: true });
});

afterAll(async () => {
    await db.close();
});

describe('Users API', () => {
    test('POST /api/users - should create a user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password123', role: 'client' });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Test User');
    });

    test('GET /api/users - should return all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/users/:id - should return one user', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('test@example.com');
    });

    test('GET /api/users/:id - should return 404 for invalid id', async () => {
        const res = await request(app).get('/api/users/999');
        expect(res.statusCode).toBe(404);
    });

    test('PUT /api/users/:id - should update a user', async () => {
        const res = await request(app)
            .put('/api/users/1')
            .send({ name: 'Updated User' });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated User');
    });

    test('DELETE /api/users/:id - should delete a user', async () => {
        const res = await request(app).delete('/api/users/1');
        expect(res.statusCode).toBe(200);
    });
});