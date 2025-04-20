const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
console.log("mongo", MONGO_URI)
//connect db for Rcords
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
