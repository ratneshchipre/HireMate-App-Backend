const express = require("express");
const connectMongoDb = require("./connect");

require("dotenv").config();

const userRouter = require("./routes/userRoutes");
const setupRouter = require("./routes/setupRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

connectMongoDb(process.env.MONGO_URI)
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/account", setupRouter);

app.listen(PORT, () => {
  console.log(`Server running successfully on PORT ${PORT}`);
});
