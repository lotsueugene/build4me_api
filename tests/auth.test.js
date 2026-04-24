const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { db, User } = require('../database/index');
const authRouter = require('../routes/api/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

beforeAll(async () => {
  await db.sync({ force: true });
});

describe('Auth API', () => {
  test('POST /api/auth/register', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Eugene',
      email: 'eugene@test.com',
      password: 'password123',
      role: 'client',
    });
    expect(res.statusCode).toBe(201);
  });

  test('POST /api/auth/login returns token', async () => {
    const hash = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Lotsu',
      email: 'lotsu@test.com',
      password: hash,
      role: 'client',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'lotsu@test.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});