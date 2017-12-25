const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
 
  title: {
    type: String,
    required: true,
    unique: true
  },

  link: {
    type: String,
    required: true
  },

  desc: {
    type: String
  },

  image: {
    type: String
  },

  // msg: { //insert message Id here for reference
  //   type: Schema.Types.ObjectId,
  //   ref: "Messages"
  // },

  msg:[{
      type: Schema.Types.ObjectId,
      ref: "Messages"
  }]

});


const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;