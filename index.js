const http = require("http");
const db = require("./src/db/models");
const app = require("./src/app")
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const initializeDb = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("PostgreSQL connection established successfully.");
  } catch (err) {
    console.log("Failed to connect with db");
  }
};

const startServer = async () => {
  await initializeDb();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
