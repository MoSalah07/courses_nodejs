const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { ADMIN, MANGER } = require("../lib/userRoles");
const allowedTo = require("../middlewares/allowedTo");

const router = express.Router();

const {
  getCourses,
  createCoures,
  getSingleCourse,
  updateCoures,
  deleteCoures,
} = require("../controllers/controller.courses");

// Validation Express;
const { validationSchema } = require("../middlewares/validation.course");

router
  .route("/")
  .get(getCourses)
  .post(verifyToken, allowedTo(MANGER), validationSchema(), createCoures);

router
  .route("/:id")
  .get(getSingleCourse)
  .patch(updateCoures)
  .delete(verifyToken, allowedTo(ADMIN, MANGER), deleteCoures);

module.exports = router;
