const db = require("../db/knex");

module.exports = function authorizeRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const user = req.user; // Set by verifyToken

      if (!user || !user.role) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // ❌ Role not allowed
      if (!allowedRoles.includes(user.role)) {
        // Log access denied
        await db("activity_logs").insert({
          user_id: user.id,
          action: "access_denied",
          description: `Denied access to ${req.method} ${req.originalUrl}`,
          created_at: db.fn.now()
        });

        return res.status(403).json({
          message: "Forbidden: You do not have permission for this action"
        });
      }

      // ✔ Access allowed
      next();
    } catch (err) {
      console.error("RBAC error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
};
