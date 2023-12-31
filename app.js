const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const connectDB = require("./helpers/init_mongodb");
const cors = require("cors");
require("dotenv").config();
require("./helpers/init_mongodb");

const AuthRoute = require("./Routes/Auth.route");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
})
);
connectDB();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRoute);

app.get("/", async (req, res, next) => {
  res.send("Hello from express.");
});

app.use(async (req, res, next) => {
  // Use next to execute the next middleware
  next(createError.NotFound());
});

// error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      // If status is not there throw internal server error (500)
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
