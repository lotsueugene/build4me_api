const request = require('supertest');
const express = require('express');
const { db, User, Project, Update, Inspection } = require('../database/index');
const inspectionsRouter = require('../routes/api/inspections');

const app = express();
app.use(express.json());
app.use('/api/inspections', inspectionsRouter);

beforeAll(async () => {
    await db.sync({ force: true });
    await User.create({ name: 'Inspector', email: 'inspector@example.com', password: 'password123', role: 'inspector' });
    await Project.create({ title: 'Test Project', location: 'Accra', startDate: '2026-01-01', clientId: 1, contractorId: 1 });
    await Update.create({ description: 'Foundation done', projectId: 1, userId: 1 });
});

afterAll(async () => {
    await db.close();
});

describe('Inspections API', () => {
    test('POST /api/inspections - should create an inspection', async () => {
        const res = await request(app)
            .post('/api/inspections')
            .send({ status: 'verified', comments: 'Looks good', projectId: 1, inspectorId: 1, updateId: 1 });
        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('verified');
    });

    test('GET /api/inspections - should return all inspections', async () => {
        const res = await request(app).get('/api/inspections');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/inspections/:id - should return one inspection', async () => {
        const res = await request(app).get('/api/inspections/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('verified');
    });

    test('GET /api/inspections/:id - should return 404 for invalid id', async () => {
        const res = await request(app).get('/api/inspections/999');
        expect(res.statusCode).toBe(404);
    });

    test('PUT /api/inspections/:id - should update an inspection', async () => {
        const res = await request(app)
            .put('/api/inspections/1')
            .send({ status: 'rejected', comments: 'Needs rework' });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('rejected');
    });

    test('DELETE /api/inspections/:id - should delete an inspection', async () => {
        const res = await request(app).delete('/api/inspections/1');
        expect(res.statusCode).toBe(200);
    });
});