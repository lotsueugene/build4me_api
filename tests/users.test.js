const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { db, User } = require('../database/index');
const usersRouter = require('../routes/api/users');
const { bearer } = require('./helpers/auth');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

let adminUser;
let createdUserId;

beforeAll(async () => {
  await db.sync({ force: true });
  const hash = await bcrypt.hash('password123', 10);
  adminUser = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: hash,
    role: 'admin',
  });
});

describe('Users API', () => {
  test('GET /api/users - 401 without auth', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/users - admin creates user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set(bearer(adminUser))
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'client',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test User');
    expect(res.body.password).toBeUndefined();
    expect(res.body.id).toBeDefined();
    createdUserId = res.body.id;
  });

  test('GET /api/users - admin lists users', async () => {
    const res = await request(app).get('/api/users').set(bearer(adminUser));
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users/:id - admin gets one user without password', async () => {
    const res = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set(bearer(adminUser));
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.password).toBeUndefined();
  });

  test('GET /api/users/:id - 404 invalid id', async () => {
    const res = await request(app).get('/api/users/999').set(bearer(adminUser));
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/users/:id - admin updates user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set(bearer(adminUser))
      .send({ name: 'Updated User' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated User');
  });

  test('DELETE /api/users/:id - admin deletes user', async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set(bearer(adminUser));
    expect(res.statusCode).toBe(200);
  });
});