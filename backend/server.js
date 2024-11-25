import express from "express";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { connectDB } from "./db/connectDB.js";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";

configDotenv();

const PORT = process.env.PORT || 8000;

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

//routes

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

//test
app.get("/api/test", (req, res) => {
  res.send("TEST HAPPY");
});

//server
app.listen(PORT, () => {
  console.log(`Server @ ${PORT}`);
  connectDB();
});
