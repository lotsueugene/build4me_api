const jwt = require('jsonwebtoken');

function signTestUser(user) {
  const u = typeof user.get === 'function' ? user.get({ plain: true }) : user;
  return jwt.sign(
    { id: u.id, name: u.name, email: u.email, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

function bearer(user) {
  return { Authorization: `Bearer ${signTestUser(user)}` };
}

module.exports = { signTestUser, bearer };