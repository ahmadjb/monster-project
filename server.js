const { MongoClient } = require("mongodb");
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRouter = require('./routes/post');

const app = express();
const port = 5000; // You can define the port for your server

// Replace the following with your Atlas connection string
const url = "mongodb+srv://ahmad119966aa:c3x19s1jhyTOotE3@mongodb.hvzzvns.mongodb.net/?retryWrites=true&w=majority";

// Connect to your Atlas cluster
mongoose.connect(url);
app.use(cors()); 
app.use(express.json());
app.use('/v1/post',postRouter);





const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("DB Connected !!");

  app.listen(port, () => {
    console.log("Server is running");
  });
});


