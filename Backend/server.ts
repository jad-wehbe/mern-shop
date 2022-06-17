import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import "colors";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`.yellow.bold);
});