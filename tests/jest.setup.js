require('dotenv').config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'jest-test-secret';
}
if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '1h';
}