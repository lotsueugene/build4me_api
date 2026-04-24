const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { db, User } = require('../database/index');
const projectsRouter = require('../routes/api/projects');
const { bearer } = require('./helpers/auth');

const app = express();
app.use(express.json());
app.use('/api/projects', projectsRouter);

let clientUser;
let contractorUser;
let adminUser;

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
  adminUser = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: hash,
    role: 'admin',
  });
});

describe('Projects API', () => {
  test('POST /api/projects - 401 without auth', async () => {
    const res = await request(app).post('/api/projects').send({
      title: 'X',
      location: 'L',
      startDate: '2026-01-01',
      contractorId: contractorUser.id,
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/projects - client creates project with valid contractor', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set(bearer(clientUser))
      .send({
        title: 'Test Project',
        description: 'A test',
        location: 'Accra',
        startDate: '2026-01-01',
        contractorId: contractorUser.id,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Project');
    expect(res.body.clientId).toBe(clientUser.id);
  });

  test('GET /api/projects - client sees only own projects', async () => {
    const res = await request(app).get('/api/projects').set(bearer(clientUser));
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((p) => p.clientId === clientUser.id)).toBe(true);
  });

  test('GET /api/projects - admin sees all', async () => {
    const res = await request(app).get('/api/projects').set(bearer(adminUser));
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/projects/:id - participant gets 200', async () => {
    const res = await request(app).get('/api/projects/1').set(bearer(clientUser));
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Project');
  });

  test('GET /api/projects/:id - 404 invalid id', async () => {
    const res = await request(app).get('/api/projects/999').set(bearer(clientUser));
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/projects/:id - contractor on project can update', async () => {
    const res = await request(app)
      .put('/api/projects/1')
      .set(bearer(contractorUser))
      .send({ title: 'Updated Project' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Project');
  });

  test('DELETE /api/projects/:id - owner deletes', async () => {
    const res = await request(app).delete('/api/projects/1').set(bearer(clientUser));
    expect(res.statusCode).toBe(200);
  });
});