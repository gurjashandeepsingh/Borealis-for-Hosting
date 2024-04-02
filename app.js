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
    .connect(
      "mongodb+srv://gurjashandeepsinghwork1:kVTMDH0lWw5cR3OS@cluster0.brapcit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoCreate: true,
      }
    )
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
