const appError = require("../lib/appError");
const { SUCCESS, FAIL, ERORR } = require("../lib/httpStatus");
const { requestSucess } = require("../lib/requests");
const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateJWT = require("../lib/generateJWT");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  return requestSucess(res, users, "users", SUCCESS);
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne(
    { email },
    { __v: false, password: false }
  );

  if (oldUser) {
    const error = appError.create("User Already Registered", 400, FAIL);
    return next(error);
  }

  // Password Hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  // generate JWT token
  const token = generateJWT(
    { email: newUser.email, id: newUser._id, role: newUser.role },
    "12h"
  );

  newUser.token = token;

  await newUser.save();

  const registerUserWithoutPassword = await User.find(
    { email },
    { password: false, __v: false }
  );

  return requestSucess(
    res,
    registerUserWithoutPassword,
    "user",
    SUCCESS,
    "",
    201
  );
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = appError.create("email and password are required", 400, FAIL);
    return next(error);
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = appError.create("User Not Found", 400, FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    const token = generateJWT(
      { email: user.email, id: user._id, role: user.role },
      "12h"
    );
    return res.status(200).json({ status: SUCCESS, data: { token } });
  } else {
    const error = appError.create("Something Wrong", 500, ERORR);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
