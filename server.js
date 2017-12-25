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

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapeNYTimes", {
    useMongoClient: true
});

require("./routes/routes.js")(app);

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});