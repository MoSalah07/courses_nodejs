// dotenv => علشان يقراء  process.env.something in file .env
require("dotenv").config();
// بيحل مشكله خاص بالمتصفح فى  cors
const cors = require("cors");

const express = require("express");
const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/user.route");
const { connectDb } = require("./lib/connectDB");
const { ERORR } = require("./lib/httpStatus");
const { requestSucess } = require("./lib/requests");
const path = require("node:path");

const app = express();

connectDb();

// فايده ميدل وير ده انى بظهر اى حاجه استاتيك سواء صور او حتى صفحات html
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// cors() => لازم تحطها قبل اى ركويست علشان تضمن انها هتشتغل على اى ip
app.use(cors());

app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

//  => هنا اى روت مش موجود اصلا  هيظهر الايرور اللى انا مهندله مش الاكسبريس
// Global middleware for not found routes
app.all("*", async (req, res, next) => {
  return requestSucess(res, "", "", ERORR, "This resource is not available");
});

// Global Error Handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || ERORR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`listening on port: ${process.env.PORT}`)
);
