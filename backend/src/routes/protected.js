// src/routes/protected.js
const express = require('express');
const router = express.Router();
const authorize = require('../middleware/rbac');
const logActivity = require('../middleware/activityLogger');

router.get('/admin-only', authorize(['Admin']), async (req, res) => {
  // activity log
  await logActivity({
    userId: req.user.id,
    action: 'access_admin_only',
    module: 'Protected',
    description: 'Admin-only resource accessed'
  });

  res.json({ ok: true, message: 'Hello Admin!' });
});

router.post('/process-sale', authorize(['Admin', 'Pharmacist', 'Cashier']), async (req, res) => {
  // ... pretend to process sale
  await logActivity({
    userId: req.user.id,
    action: 'sale_processing',
    module: 'Sales',
    description: `Processed sale: ${JSON.stringify(req.body) || 'n/a'}`
  });

  res.json({ ok: true, message: 'Sale processed' });
});

module.exports = router;
