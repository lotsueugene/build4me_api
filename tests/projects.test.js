const request = require('supertest');
const express = require('express');
const { db, User, Project } = require('../database/index');
const projectsRouter = require('../routes/api/projects');

const app = express();
app.use(express.json());
app.use('/api/projects', projectsRouter);

beforeAll(async () => {
    await db.sync({ force: true });
    await User.create({ name: 'Client', email: 'client@example.com', password: 'password123', role: 'client' });
    await User.create({ name: 'Contractor', email: 'contractor@example.com', password: 'password123', role: 'contractor' });
});

afterAll(async () => {
    await db.close();
});

describe('Projects API', () => {
    test('POST /api/projects - should create a project', async () => {
        const res = await request(app)
            .post('/api/projects')
            .send({ title: 'Test Project', description: 'A test', location: 'Accra', startDate: '2026-01-01', clientId: 1, contractorId: 2 });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test Project');
    });

    test('GET /api/projects - should return all projects', async () => {
        const res = await request(app).get('/api/projects');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/projects/:id - should return one project', async () => {
        const res = await request(app).get('/api/projects/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Test Project');
    });

    test('GET /api/projects/:id - should return 404 for invalid id', async () => {
        const res = await request(app).get('/api/projects/999');
        expect(res.statusCode).toBe(404);
    });

    test('PUT /api/projects/:id - should update a project', async () => {
        const res = await request(app)
            .put('/api/projects/1')
            .send({ title: 'Updated Project' });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Project');
    });

    test('DELETE /api/projects/:id - should delete a project', async () => {
        const res = await request(app).delete('/api/projects/1');
        expect(res.statusCode).toBe(200);
    });
});
