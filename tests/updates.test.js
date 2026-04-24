const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { db, User, Project } = require('../database/index');
const updatesRouter = require('../routes/api/updates');
const { bearer } = require('./helpers/auth');

const app = express();
app.use(express.json());
app.use('/api/updates', updatesRouter);

let clientUser;
let contractorUser;

beforeAll(async () => {
  await db.sync({ force: true });
  const hash = await bcrypt.hash('password123', 10);
  clientUser = await User.create({
    name: 'Client',
    email: 'client@test.com',
    password: hash,
    role: 'client',
  });
  contractorUser = await User.create({
    name: 'Contractor',
    email: 'contractor@test.com',
    password: hash,
    role: 'contractor',
  });
  await Project.create({
    title: 'Test Project',
    location: 'Accra',
    startDate: '2026-01-01',
    clientId: clientUser.id,
    contractorId: contractorUser.id,
  });
});

describe('Updates API', () => {
  test('POST /api/updates - 401 without auth', async () => {
    const res = await request(app).post('/api/updates').send({
      description: 'Foundation done',
      projectId: 1,
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/updates - contractor creates update', async () => {
    const res = await request(app)
      .post('/api/updates')
      .set(bearer(contractorUser))
      .send({
        description: 'Foundation done',
        projectId: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.description).toBe('Foundation done');
    expect(res.body.userId).toBe(contractorUser.id);
  });

  test('GET /api/updates - contractor sees scoped updates', async () => {
    const res = await request(app).get('/api/updates').set(bearer(contractorUser));
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/updates/:id - participant gets 200', async () => {
    const res = await request(app).get('/api/updates/1').set(bearer(contractorUser));
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('Foundation done');
  });

  test('GET /api/updates/:id - 404 invalid id', async () => {
    const res = await request(app).get('/api/updates/999').set(bearer(contractorUser));
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/updates/:id - author updates', async () => {
    const res = await request(app)
      .put('/api/updates/1')
      .set(bearer(contractorUser))
      .send({ description: 'Foundation completed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('Foundation completed');
  });

  test('DELETE /api/updates/:id - author deletes', async () => {
    const res = await request(app).delete('/api/updates/1').set(bearer(contractorUser));
    expect(res.statusCode).toBe(200);
  });
});