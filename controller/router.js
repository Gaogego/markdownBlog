const Article = require("../models/article");
const express = require("express");
const router = express.Router();

//  res.render("index", { articles: articles });
router.get("/new", (req, res) => res.render("articles/new", { article: new Article() }));

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article) res.render("articles/edit", { article: article });
});

///articles/62eac052a79722329be32dc0
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

//post
router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

//put
router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    if (!req.article) res.redirect("/");
    //article.id never changed on update.
    next();
  },
  saveArticleAndRedirect("edit")
);

//delete
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  //NOTICE: Arrow Function goes error here.
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    // save
    try {
      ret = await article.save();
      res.redirect(`/articles/${ret.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
