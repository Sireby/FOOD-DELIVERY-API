const express = require("express");
const app = express();
const dotenv = require("dotenv");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
dotenv.config({path : "./config.env"});
const UserRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute")
const authRoutes = require("./routes/auth-route");
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cookieParser());

var accessLogStream = fs.createWriteStream(path.join("utils", 'access.log'), {
    flags : 'a'
});

app.use(morgan('dev', { stream : accessLogStream }));

app.use("/api/v1/auths", authRoutes);

module.exports = app;