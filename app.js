import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { logger } from "./winstonLogger.js";
import { userRoutes } from "./src/routes/userRoutes/userRoutes.js";
import { businessRoutes } from "./src/routes/businessRoutes/businessRoutes.js";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/vendor", businessRoutes);

function mongoDBConnection() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/borealis", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoCreate: true,
    })
    .then(() => {
      logger.info("Database connected");
    })
    .catch((error) => {
      logger.error(error);
    });
}

function serverStart() {
  app.listen(process.env.PORT, () => {
    logger.info("Server is running");
  });
}

function appStartup() {
  mongoDBConnection();
  serverStart();
}

appStartup();
