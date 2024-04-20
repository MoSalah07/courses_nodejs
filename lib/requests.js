const { SUCCESS, FAIL, ERORR } = require("./httpStatus");

const requestSucess = (
  res,
  data = [],
  dataName = "",
  status = SUCCESS,
  err = "",
  statusCode = 200
) => {
  switch (status) {
    case FAIL:
      return res.status(404).json({ status: status, [dataName]: data });
    case ERORR:
      return res.status(400).json({ status: status, message: err });
    default:
      return res
        .status(statusCode || 200)
        .json({ status: status, data: { [dataName]: data } });
  }
};

module.exports = {
  requestSucess,
};
