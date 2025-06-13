const express = require("express");
const connectMongoDb = require("./connect");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

connectMongoDb(process.env.MONGO_URI)
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running successfully on PORT ${PORT}`);
});
