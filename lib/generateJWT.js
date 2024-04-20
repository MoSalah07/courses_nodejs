const jwt = require("jsonwebtoken");

// jwt work without async

module.exports = (payload, time = "12h") => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: time,
  });

  return token;
};
