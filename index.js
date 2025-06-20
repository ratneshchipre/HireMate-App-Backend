const express = require("express");
const connectMongoDb = require("./connect");

require("dotenv").config();

const userRouter = require("./routes/userRoutes");
const otpRouter = require("./routes/otpRoutes");
const setupRouter = require("./routes/setupRoutes");
const fileUploadRouter = require("./routes/fileUploadRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

connectMongoDb(process.env.MONGO_URI)
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use("/api/user", userRouter); // Authentication route
app.use("/api/verify-user", otpRouter); // Verify user route
app.use("/api/account", setupRouter); // Setup route
app.use("/api/company", fileUploadRouter); // File upload route

app.listen(PORT, () => {
  console.log(`Server running successfully on PORT ${PORT}`);
});
