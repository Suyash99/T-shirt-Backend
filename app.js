require('dotenv').config()
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//My Routes
const authRoutes = require("./Routes/auth")
const userRoutes = require("./Routes/user")
const categoryRoutes = require("./Routes/category")
const productRoutes = require("./Routes/product")
const orderRoutes = require("./Routes/order")

//DB Connection
mongoose.connect(process.env.DATABASE, {
useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false
}).then(() =>{
    console.log("DB CONNECTED!")
}).catch(() =>{
    console.log("DB got Bugs!")
})

//Middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

//PORT
const port = process.env.PORT || 8000;

//Starting Server
app.listen(port, () =>{
    console.log(`App is running at http://localhost:${port}`);
})