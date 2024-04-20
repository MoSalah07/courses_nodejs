// Express Validator
const { body, param, query, validationResult } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 2 })
      .withMessage("title at least 2 characters"),
    body("price").notEmpty().withMessage("price is required"),
    // .isLength({ min: 1 }),
    // .withMessage("price at least 1 characters"),
  ];
};

module.exports = { validationSchema };
