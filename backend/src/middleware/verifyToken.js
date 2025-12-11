const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "change_me";

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Exposes user id + role

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
