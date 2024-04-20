const Course = require("../models/course.model");
const { validationResult } = require("express-validator");
const { requestSucess } = require("../lib/requests");
const { SUCCESS, FAIL, ERORR } = require("../lib/httpStatus");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../lib/appError");

const getCourses = asyncWrapper(async (req, res, next) => {
  // Pagination
  const query = req.query;
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  return requestSucess(res, courses, "courses", SUCCESS);
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    const error = appError.create("Course Not Found", 404, FAIL);
    return next(error);
    // return requestSucess(res, "Course Not Found", "data", FAIL);
  }

  return requestSucess(res, course, "course", SUCCESS);
  // try {
  //   const course = await Course.findById(req.params.id);
  //   if (!course) {
  //     return requestSucess(res, "Course Not Found", "data", FAIL);
  //   }
  //   return requestSucess(res, course, "course", SUCCESS);
  // } catch (err) {
  //   return requestSucess(res, null, null, ERORR, err && err.message);
  // }
});

const createCoures = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, FAIL);
    return next(error);
    // return requestSucess(res, errors.array(), "errors", FAIL);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  return requestSucess(res, newCourse, "course", SUCCESS);
});

const updateCoures = asyncWrapper(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, {
    $set: { ...req.body },
  });
  if (!course) {
    const error = appError.create("Course not found", 400, FAIL);
    return next(error);
  }
  // const updateCurrentCourse = await Course.updateOne(
  //   {
  //     _id: req.params.id,
  //   },
  //   { $set: req.body }
  // );

  // return res.status(200).json(course);
  return requestSucess(res, course, "course", SUCCESS);
});

// const updateCoures = (req, res) => {
//   const id = converIdToNumber(req.params.id);
//   let findCurrentCoures = courses.find((course) => course.id === id);
//   if (!findCurrentCoures) {
//     return res.status(404).json({ message: "Course not found" });
//   }
//   courses = courses.map((course) =>
//     course.id === id ? { ...course, ...req.body } : course
//   );
//   findCurrentCoures = { ...findCurrentCoures, ...req.body };
//   return res.status(200).json(findCurrentCoures);
// };

const deleteCoures = asyncWrapper(async (req, res, next) => {
  const isCourseDelete = await Course.deleteOne({ _id: req.params.id });
  if (isCourseDelete.deletedCount === 0) {
    const error = appError.create("Course Not Found", 400, FAIL);
    return next(error);
  }
  return requestSucess(res, null, "data", SUCCESS);
});

module.exports = {
  getCourses,
  getSingleCourse,
  createCoures,
  updateCoures,
  deleteCoures,
};
