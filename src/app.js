import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import 'dotenv/config';

import routerProducts from "./routes/products.router.js";
import routerViews from "./routes/views.router.js";
import MessageModel from "./dao/models/chat.model.js";
import ProductModel from "./dao/models/product.model.js";

import __dirname from "./utils.js";

const app = express();
const mongoDB = "ecommerce";

// Config express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config static
app.use(express.static(__dirname + "/public"));

// Set engine
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Use routes
app.use("/", routerViews);
app.use("/api/products", routerProducts);
app.get("*", (req, res) => res.render("notfound", {}));

const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGODB_URI, { dbName: mongoDB })
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => console.error("Connection failed"));

const httpServer = app.listen(PORT, () => console.log("Running..."));
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("New socket");

  const messages = await MessageModel.find().lean().exec();
  io.emit("logs", messages);

  socket.on("message", async (data) => {
    console.log(data);
    const newMessage = data;
    const result = await MessageModel.create(newMessage);
    console.log({ result });
    const updatedMessages = await MessageModel.find().lean().exec();
    io.emit("logs", updatedMessages);
  });

  socket.on("products", async ({ productID, confirm }) => {
    console.log(productID, confirm);
  });

  const p = await ProductModel.find().lean().exec();
  socket.emit("products", p);
});