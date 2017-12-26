const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

let databaseUri = "mongodb://localhost/scrapeNYTimes";

mongoose.Promise = Promise;

/**
 * If its local it will use the local db. If its running
 * on Heroku it will use the Heroku database.
 */
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);   
}

require("./routes/routes.js")(app);

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});