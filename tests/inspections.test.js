const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { db, User, Project, Update } = require('../database/index');
const inspectionsRouter = require('../routes/api/inspections');
const { bearer } = require('./helpers/auth');

const app = express();
app.use(express.json());
app.use('/api/inspections', inspectionsRouter);

let clientUser;
let contractorUser;
let inspectorUser;

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
  inspectorUser = await User.create({
    name: 'Inspector',
    email: 'inspector@test.com',
    password: hash,
    role: 'inspector',
  });
  await Project.create({
    title: 'Test Project',
    location: 'Accra',
    startDate: '2026-01-01',
    clientId: clientUser.id,
    contractorId: contractorUser.id,
  });
  await Update.create({
    description: 'Foundation done',
    projectId: 1,
    userId: contractorUser.id,
  });
});

describe('Inspections API', () => {
  test('POST /api/inspections - 401 without auth', async () => {
    const res = await request(app).post('/api/inspections').send({
      status: 'verified',
      comments: 'Looks good',
      projectId: 1,
      updateId: 1,
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/inspections - inspector creates inspection', async () => {
    const res = await request(app)
      .post('/api/inspections')
      .set(bearer(inspectorUser))
      .send({
        status: 'verified',
        comments: 'Looks good',
        projectId: 1,
        updateId: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('verified');
    expect(res.body.inspectorId).toBe(inspectorUser.id);
  });

  test('GET /api/inspections - inspector sees own', async () => {
    const res = await request(app).get('/api/inspections').set(bearer(inspectorUser));
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/inspections/:id - inspector gets one', async () => {
    const res = await request(app).get('/api/inspections/1').set(bearer(inspectorUser));
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('verified');
  });

  test('GET /api/inspections/:id - 404 invalid id', async () => {
    const res = await request(app).get('/api/inspections/999').set(bearer(inspectorUser));
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/inspections/:id - inspector updates own', async () => {
    const res = await request(app)
      .put('/api/inspections/1')
      .set(bearer(inspectorUser))
      .send({ status: 'rejected', comments: 'Needs rework' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('rejected');
  });

  test('DELETE /api/inspections/:id - inspector deletes own', async () => {
    const res = await request(app).delete('/api/inspections/1').set(bearer(inspectorUser));
    expect(res.statusCode).toBe(200);
  });
});