const { ValidationError } = require("yup");
const {
  BaseError,
  ValidationError: SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} = require("sequelize");

const validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      errors: err.errors.map((message) => ({
        status: 400,
        title: "Validation Error",
        detail: message,
      })),
    });
  }
  next(err);
};

const sequelizeErrorHandler = (err, req, res, next) => {
  if (
    err instanceof SequelizeValidationError ||
    err instanceof UniqueConstraintError
  ) {
    return res.status(400).json({
      errors: err.errors.map((e) => ({
        status: 400,
        title: "Database Validation Error",
        detail: e.message,
      })),
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      errors: [
        {
          status: 400,
          title: "Foreign Key Constraint Error",
          detail: "Referenced record does not exist",
        },
      ],
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(400).json({
      errors: [
        {
          status: 400,
          title: "Database Query Error",
          detail: err.message,
        },
      ],
    });
  }

  if (err instanceof BaseError) {
    return res.status(500).json({
      errors: [
        {
          status: 500,
          title: "Sequelize Error",
          detail: err.message,
        },
      ],
    });
  }

  next(err);
};

const generalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  return res.status(status).json({
    errors: [
      {
        status,
        title: err.name || "Internal Server Error",
        detail: err.message || "Something went wrong",
      },
    ],
  });
};

module.exports = {
  validationErrorHandler,
  sequelizeErrorHandler,
  generalErrorHandler,
};
