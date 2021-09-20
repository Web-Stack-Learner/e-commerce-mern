const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config({ path: "./config.env" });
//Middleware
app.use(express.json());

//Mongoose Database Connection
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => console.error(err));

//Route
const userRouter = require("./routes/user");
app.use("/api/auth/", userRouter);

//Server Listen
app.listen(process.env.PORT);
