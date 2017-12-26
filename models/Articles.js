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
  
  /**
   * Set up as an array to allow multiple ObjectIds to be saved.
   */
  msg:[{
      type: Schema.Types.ObjectId,
      ref: "Messages"
  }]

});


const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;