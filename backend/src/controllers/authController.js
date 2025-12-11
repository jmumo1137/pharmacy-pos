// controllers/authController.js
const db = require('../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logActivity = require('../middleware/activityLogger'); // created below

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const TOKEN_EXPIRY = '8h';

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'Cashier' } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const existing = await db('users').where({ email }).first();
    if (existing) return res.status(400).json({ message: 'email already exists' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const [id] = await db('users').insert({
      name,
      email,
      password: hashed,
      created_at: db.fn.now()
    });

    // fetch created user
    const user = await db('users').where({ id }).first();
    if (!user) return res.status(500).json({ message: 'could not create user' });

    // find role row (fallback to cashier if not found)
    const roleRow = await db('roles').where({ name: role }).first();
    if (!roleRow) {
      // fallback: try Cashier, else pick first role
      const fallback = await db('roles').where({ name: 'Cashier' }).first() || (await db('roles').first());
      await db('user_roles').insert({ user_id: user.id, role_id: fallback.id });
    } else {
      await db('user_roles').insert({ user_id: user.id, role_id: roleRow.id });
    }

    // reload roles for user
    const userRoles = await db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .where('user_roles.user_id', user.id)
      .select('roles.name');

    const roles = userRoles.map(r => r.name);

    // log user creation
    await logActivity({
      userId: user.id,
      action: 'user_creation',
      module: 'Auth',
      description: `User created with roles: ${roles.join(', ')}`
    });

    // hide password before sending
    delete user.password;
    // return user (no token on registration; client can login next)
    res.status(201).json({ user, roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(401).json({ message: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });

    // load roles
    const userRoles = await db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .where('user_roles.user_id', user.id)
      .select('roles.name');

    const roles = userRoles.map(r => r.name);

    const token = jwt.sign(
      { id: user.id, email: user.email, roles },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // update last_login
    await db('users').where({ id: user.id }).update({ last_login: db.fn.now() });

    // log login
    await logActivity({
      userId: user.id,
      action: 'login',
      module: 'Auth',
      description: 'User logged in'
    });

    delete user.password;
    res.json({ token, user: { ...user, roles } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};
