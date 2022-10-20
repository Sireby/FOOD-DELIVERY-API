const express = require("express");
const app = express();
const dotenv = require("dotenv");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
dotenv.config({ path: "./config.env" });
const UserRouter = require("./src/routes/userRoute");
const menuRouter = require("./src/routes/menuRoute");
const cartRouter = require("./src/routes/cartRoute");
const orderRouter = require("./src/routes/orderRoute");
const authRoutes = require("./src/routes/auth-route");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

app.use(express.json());

app.use(cookieParser());

var accessLogStream = fs.createWriteStream(
  path.join("./src/utils", "access.log"),
  {
    flags: "a",
  }
);

app.use(morgan("dev", { stream: accessLogStream }));

app.use("/api/v1/auths", authRoutes);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/products", menuRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRouter);

const db = async () => {
  await mongoose.connect(process.env.DB_URL);
};
db()
mongoose.connection.once("open", () => {
  console.log("Connected To Database!");
  
});

module.exports = app;
