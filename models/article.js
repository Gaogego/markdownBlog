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
