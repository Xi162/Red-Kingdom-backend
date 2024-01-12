const express = require("express");
const router = express.Router();
const { sequelize } = require("../../sequelize/index");
const get_jwt = require("../middlewares/get_jwt");
const authorization = require("../middlewares/authorization");

const models = sequelize.models;

// GET all articles
router.get("/", async (req, res) => {
  // Logic to fetch all articles from the database
  try {
    let articles = await models.Article.findAll();
    console.log(JSON.stringify(articles, null, 2));
    articles = articles.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.status(200).json(articles);
  } catch (e) {
    console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

// GET a specific article by ID
router.get("/:id", async (req, res) => {
  const articleId = req.params.id;
  try {
    const article = await models.Article.findByPk(articleId);
    if (!article) throw new Error("No article found");
    let contents = await article.getArticleBlocks();
    contents = contents.map((content) => {
      let { ArticleBlock, ...contentInfo } = content.get();
      return {
        ...contentInfo,
      };
    });
    let result = {
      ...article.get(),
      contents: contents,
    };
    console.log(JSON.stringify(result, null, 2));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

// const contents = [
//   {
//     id: 1,
//     content: "This is the first content",
//     type: "text",
//   },
//   {
//     id: 2,
//     content: "path/to/image",
//     type: "image",
//   },
//   {
//     id: 3,
//     content: "This is the third content",
//     type: "subtitle",
//   },
// ];

// CREATE a new article
router.post("/", get_jwt, authorization, async (req, res) => {
  const articleData = req.body;
  try {
    if (
      !articleData.title ||
      !articleData.image ||
      !articleData.userID ||
      !articleData.contents
    )
      throw new Error("Bad request");
    const newArticle = models.Article.build({
      title: articleData.title,
      image: articleData.image,
      UserId: articleData.userID,
    });
    await newArticle.save();
    for (let i = 0; i < articleData.contents.length; i++) {
      let content = articleData.contents[i];
      let newContent = models.ArticleBlock.build({
        content: content.content,
        type: content.type,
        BlockID: i,
        ArticleID: newArticle.id,
      });
      await newContent.save();
      //   newArticle.addContent(newContent);
    }
    res.status(200).json({
      msg: "Article created",
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

// UPDATE an existing article
router.put("/:id", get_jwt, authorization, async (req, res) => {
  const articleId = req.params.id;
  const articleData = req.body;
  try {
    const article = await models.Article.findByPk(articleId);
    if (!article) throw new Error("No article found");
    article.title = articleData.title ? articleData.title : article.title;
    article.image = articleData.image ? articleData.image : article.image;
    await article.save();
    let contents = await article.getArticleBlocks();
    contents.forEach(async (content) => {
      await content.destroy();
    });
    for (let i = 0; i < articleData.contents.length; i++) {
      let content = articleData.contents[i];
      let newContent = models.ArticleBlock.build({
        content: content.content,
        type: content.type,
        BlockID: i,
        ArticleID: article.id,
      });
      await newContent.save();
      //   newArticle.addContent(newContent);
    }
    res.status(200).json({
      msg: "Article updated",
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({
      msg: e.message,
    });
  }
});

// DELETE an article
router.delete("/:id", get_jwt, authorization, async (req, res) => {
  const articleId = req.params.id;
  // Logic to delete the article with the given ID from the database
  try {
    const article = await models.Article.findByPk(articleId);
    if (!article) throw new Error("No article found");
    await article.destroy();
    res.status(200).json({
      msg: "Article deleted",
    });
  } catch (e) {
    res.status(403).json({
      msg: e.message,
    });
  }
});

module.exports = router;
