# [How To Build A Markdown Blog Using Node.js, Express, And MongoDB](https://www.youtube.com/watch?v=1NrHkjlWVhM&t=169s)

[typescript-express-starter](https://www.npmjs.com/package/typescript-express-starter) run `npx typescript-express-starter` 

基于ejb实现的blog应用，采用express+mongoose+ejs作为技术框架；使用slugify在数据写入前对数据进行预处理；使用marked和jsdom实现对markdown代码的展现；采用[bootstrap](https://maxcdn.bootstrapcdn.com)展现样式。

ejs关键语法`res.render("articles/show", { article: article });`，默认视图文件为项目文件夹下的views文件夹，并传入展示对象（此处为article）。

注意 async/await的使用，否则在query和save的时候无法得到预期效果。



## 1. package

```bash
npm install express  mongoose ejs method-override dotenv
npm install slugify marked jsdom
npm install --save-dev nodemon 
```

## 2. slugify & marked

```javascript
# models/article.js

const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const createDompurify = require("dompurify");
const { JSDOM } = require("jsdom");
const marked = require("marked");

const articleSchema = new mongoose.Schema({
  title: { required: true, type: String },
  description: { type: String },
  markdown: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  sanitizedHtml: { type: String, required: true },
});

articleSchema.pre("validate", function (next) {
  //NOTICE: arrow function fails here
  this.slug = slugify(this.title, { lower: true, strict: true });
  //sanitized markdown
  const dompurify = createDompurify(new JSDOM().window);
  this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
  next();
});

module.exports = mongoose.model("article", articleSchema);
```



