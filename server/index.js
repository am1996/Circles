require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const routers = require("./routers");
const app = express();
const cors = require("cors");
const connectToMongo = require('./config/db');
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

// Function to initialize the app (includes connection and middleware)
const initializeApp = async () => {
  const cs = process.env.MONGO_URL;
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use("/",routers);
  await connectToMongo(cs);
};


app.listen(port,async ()=>{
  await initializeApp();
  console.log("listening on port " + port);
});