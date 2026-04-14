const request = require('supertest');
const express = require('express');
const { db, User, Project, Update } = require('../database/index');
const updatesRouter = require('../routes/api/updates');

const app = express();
app.use(express.json());
app.use('/api/updates', updatesRouter);

beforeAll(async () => {
    await db.sync({ force: true });
    await User.create({ name: 'Contractor', email: 'contractor@example.com', password: 'password123', role: 'contractor' });
    await Project.create({ title: 'Test Project', location: 'Accra', startDate: '2026-01-01', clientId: 1, contractorId: 1 });
});

afterAll(async () => {
    await db.close();
});

describe('Updates API', () => {
    test('POST /api/updates - should create an update', async () => {
        const res = await request(app)
            .post('/api/updates')
            .send({ description: 'Foundation done', projectId: 1, userId: 1 });
        expect(res.statusCode).toBe(201);
        expect(res.body.description).toBe('Foundation done');
    });

    test('GET /api/updates - should return all updates', async () => {
        const res = await request(app).get('/api/updates');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/updates/:id - should return one update', async () => {
        const res = await request(app).get('/api/updates/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.description).toBe('Foundation done');
    });

    test('GET /api/updates/:id - should return 404 for invalid id', async () => {
        const res = await request(app).get('/api/updates/999');
        expect(res.statusCode).toBe(404);
    });

    test('PUT /api/updates/:id - should update an update', async () => {
        const res = await request(app)
            .put('/api/updates/1')
            .send({ description: 'Foundation completed' });
        expect(res.statusCode).toBe(200);
        expect(res.body.description).toBe('Foundation completed');
    });

    test('DELETE /api/updates/:id - should delete an update', async () => {
        const res = await request(app).delete('/api/updates/1');
        expect(res.statusCode).toBe(200);
    });
});