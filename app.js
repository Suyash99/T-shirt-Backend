require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const {runningEnv} = require('./config')
const env = runningEnv()
const DATABASE = process.env[`DATABASE_${env}`]

//My Routes
const authRoutes = require("./Routes/auth");
const userRoutes = require("./Routes/user");
const categoryRoutes = require("./Routes/category");
const productRoutes = require("./Routes/product");
const orderRoutes = require("./Routes/order");
const stripePayment = require("./Routes/stripePayment");

//DB Connection
mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED!");
  })
  .catch((err) => {
    console.log("DB got Bugs! ERR: " + err.message);
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripePayment);

//Basic route for testing
app.get("/", (req, res) => {
  res.send("Basic Route Working! Application running on " + env)
});

//PORT
const port = process.env.PORT || 8000;

//Starting Server
app.listen(port, () => {
  console.log(`App is running at http://localhost:${port} Env- ${env}`);
});
