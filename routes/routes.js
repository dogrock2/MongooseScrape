const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const db = require("../models");

let results = [];

module.exports = function (app) {
    //Default route. 
    app.get("/", function (req, res) {        
        res.render("index", { dbResult: results });
    });    
    //Gets all saved articles from db and send them back to client. Client will get the length
    //to keep track of saved articles count.
    app.get("/getCnt", function (req, res) {
        db.Article.find({}).then(function(result) {
            res.send(result);
        });
    });
    //Gets all articles from db and send data to be rendered by handlebars savedArticles page. 
    app.get("/saved", function (req, res) {
        db.Article.find({}).then(function(result) {            
            res.render("savedArticles", { dbSavedResult: result });            
        });
    });
    //Retrieves all saved articles and populates if any of them have saved messages.
    app.post("/saved/getMessages", function (req, res) {        
        db.Article.find({ title: req.body.title }).populate("msg")
        .then(function(result) {   
            res.send(result);
        }).catch(function(err) {      
            console.log(err);
            res.json('err');
        });
    });
    //Save notes to the messages db and pushes the message's id to the corresponding article entry.
    app.post("/saved/setMessages", function (req, res) {        
        db.Msg.create({ body: req.body.msg }).then(function(data){
            return db.Article.findOneAndUpdate({ title: req.body.title }, { $push: {msg: data._id} }, { new: true }).then(function(){
                res.send('ok');
            });
        });
    });
    //Deletes single message when the X is clicked.
    app.delete("/MSGdelete", function (req, res) {
        db.Msg.remove(req.body).then(function(result) {
            res.send('ok');
        }).catch(function(err) {
            res.send('error');
        });
    });
    //Deletes the saved article entry from db and any associated messages gets deleted too.
    app.delete("/delete", function (req, res) {
        let msg2Del;
        db.Article.findOne({ title: req.body.title }).then(function(result1) {
            msg2Del = result1.msg;           
            db.Article.remove({title: req.body.title}).then(function(result2) {   
                db.Msg.remove({_id: {$in: msg2Del}}).then(function(result3) {});                   
                res.send('ok');
            }).catch(function(err) {
                res.send('error');
            });
        });
    });
    //Saves articles to db and sends error back if duplicates. Wont save duplicates.
    app.post("/saving", function (req, res) {       
       db.Article.create(req.body).then(function(result) {
         res.send('ok');
       }).catch(function(err) {
           if(err.code === 11000){
             console.log("ERROR: Duplicate entry");
             res.send('11000');
           } else {  
             console.log(err);
           }
      });
    });
    /**
     * This scrapes the NYTimes site for latest articles. Saves only the ones with a title, a link 
     * and a description. Any other wont save. Saves a max of 20 artcles. ( Images are optional ).
     */
    app.get("/scrape", function (req, res) {

        request("https://www.nytimes.com/", function (error, response, html) {

            let $ = cheerio.load(html);

            $("article.story").each(function (i, element) {
                let title = $(element).children("h2.story-heading").children("a").text();
                let link = $(element).children("h2.story-heading").children("a").attr("href");
                let img = $(element).children("div.thumb").children("a").children("img").attr("src");
                let desc = $(element).children("p.summary").text();                
                 
                if (results.length < 20 && title && link && desc)
                    results.push({
                        title: title,
                        link: link,
                        img: img,
                        desc: desc.trim()
                    });
            });            
            res.json(results);
        });
    }); //ends scraped route

}; //ends module exports