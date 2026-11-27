const express = require("express");
const cors = require("cors")
const router = require("./routers");
const { errorHandlers } = require("./middlewares");

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api',router);

app.use(errorHandlers.validationErrorHandler);
app.use(errorHandlers.sequelizeErrorHandler);
app.use(errorHandlers.generalErrorHandler);

module.exports = app;