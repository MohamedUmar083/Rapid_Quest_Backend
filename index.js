import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customerRouter from "./Router/customerRouter.js";
import orderRouter from "./Router/orderRouter.js";
import productRouter from "./Router/productRouter.js";
import connectDB from "./Database/dbConfig.js";

dotenv.config();

connectDB();

const app = express();
//middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/ping", (req, res) => {
  res.status(200).send("This Api Works Good");
});

app.use("/api/customer", customerRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);

//Listen
app.listen(process.env.PORT, () => {
  console.log("App is Running Successfully");
});
