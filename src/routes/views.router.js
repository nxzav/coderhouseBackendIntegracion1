import { Router } from "express";
import ProductModel from "../dao/models/product.model.js";
import MessageModel from "../dao/models/chat.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await ProductModel.find().lean().exec();
  res.render("home", { products });
});

router.get("/chat", async (req, res) => {
  const messages = await MessageModel.find().lean().exec();
  res.render("chat", { messages });
});

router.get("/realtimeproducts", async (req, res) => {
  const p = await ProductModel.find().lean().exec();
  res.render("realTime", { p });
});

export default router;