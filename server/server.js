const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const dbConnection = require("./db");
const errorMiddleware = require("./middleware/errorMiddleware");

// .env
dotenv.config({ path: path.resolve(__dirname, "./config/config.env") });

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

dbConnection();
// Server Running
app.use(errorMiddleware);
const PORT = process.env.PORT || 9000;
const { NODE_ENV } = process.env;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT} in ${NODE_ENV} Mode`);
});
