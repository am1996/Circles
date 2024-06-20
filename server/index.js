require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const routers = require("./routers");
const app = express();
const cors = require("cors");
const connectToMongo = require('./config/db');
const logger = require('./middlewares/Logger');
const ErrorHandle = require('./middlewares/ErrorHandle');
const path = require("path");
const uploadPath = path.join(path.resolve("."), "public", "uploads");
const http = require('http');
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
};

// Function to initialize the app (includes connection and middleware)
const initializeApp = async () => {
  const cs = process.env.MONGO_URL;
  app.use(logger);
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use("/", routers);
  app.use(ErrorHandle);
  app.use('/uploads', express.static(uploadPath));
  await connectToMongo(cs);
};

server.listen(port, async () => {
  await initializeApp();
  console.log("listening on port " + port);
});