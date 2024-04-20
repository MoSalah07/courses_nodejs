const jwt = require("jsonwebtoken");
const appError = require("../lib/appError");
const { ERORR, FAIL } = require("../lib/httpStatus");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create("Token is required", 401, FAIL);
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // هنا انا غيرت فى ركويست وهيكون شامل على اى ميدل وير جاى بعد ميدل وير verifytoken
    // هيظهر خواص فى اى ميدل وير بعد verifytoken
    // اقدر اكسيس عليها
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("Invalid token", 401, ERORR);
    return next(error);
  }
};

module.exports = verifyToken;
