// middleware/activityLogger.js
const db = require('../db/knex');

const logActivity = async ({ userId, action, module, description }) => {
  try {
    if (!userId) return;
    await db('activity_logs').insert({
      user_id: userId,
      action,
      module,
      description,
      created_at: db.fn.now()
    });
  } catch (err) {
    console.error('Activity log error:', err);
  }
};

module.exports = logActivity;
