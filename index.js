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

// Routes
app.use("/api/user", userRouter); // Authentication route
app.use("/api/send-otp", otpRouter); // Send OTP route
app.use("/api/account", setupRouter); // Setup route
app.use("/api/company", fileUploadRouter); // File upload route

app.listen(PORT, () => {
  console.log(`Server running successfully on PORT ${PORT}`);
});
