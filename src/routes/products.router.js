import { Router } from "express";
// import products from "../dao/products.js";
import ProductModel from '../dao/models/product.model.js';

const router = Router();

router.get("/", async (req, res) => {
  const products = await ProductModel.find().lean().exec();

  res.send({products});
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  res.send(newProduct);
});

router.put("/", (req, res) => {
  res.json("PUT products");
});

router.delete("/", (req, res) => {
  res.json("DELETE products");
});

export default router;