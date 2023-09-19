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
const router = require("./routes");

// .env
dotenv.config({ path: path.resolve(__dirname, "./config/config.env") });

// Middlewares
const dirname = path.resolve(path.dirname(""));
app.use(express.static(path.join(dirname, "views/build")));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use(router);

// Database connection
dbConnection();

// Error handlers
app.use(errorMiddleware);

// Server Running
const PORT = process.env.PORT || 9000;
const { NODE_ENV } = process.env;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT} in ${NODE_ENV} Mode`);
});
