const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const router = require("./controller/router");
const Article = require("./models/article");

require("dotenv").config();

const app = express();

//mongoose
mongoose.connect(process.env.MONGO_URI, {});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", router);
app.use("*", (req, res) => res.send("opps, not found."));
app.listen(3000, () => console.log("markdown server running on port 3000."));
