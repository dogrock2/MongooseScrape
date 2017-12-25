const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const db = require("../models");

let results = [];
let tester = [
    {
    title: "This is the title",
    link: "This is the link",
    img: "Image link",
    desc: "A description"
    }, {
    title: "This is the title2",
    link: "This is the link2",
    img: "Image link2",
    desc: "A description2"
    }
];

module.exports = function (app) {

    app.get("/", function (req, res) {        
        res.render("index", { dbResult: results });
    });    
    app.get("/getCnt", function (req, res) {
        db.Article.find({}).then(function(result) {
            res.send(result);
        });
    });
    app.get("/saved", function (req, res) {
        db.Article.find({}).then(function(result) {            
            res.render("savedArticles", { dbSavedResult: result });            
        });
    });
    app.post("/saved/getMessages", function (req, res) {        
        db.Article.find({ title: req.body.title }).populate("msg")
        .then(function(result) {   
            res.send(result);
        }).catch(function(err) {      
            console.log(err);
            res.json('err');
        });
    });
    app.post("/saved/setMessages", function (req, res) {        
        db.Msg.create({ body: req.body.msg }).then(function(data){
            return db.Article.findOneAndUpdate({ title: req.body.title }, { $push: {msg: data._id} }, { new: true }).then(function(){
                res.send('ok');
            });
        });
    });
    app.delete("/MSGdelete", function (req, res) {
        db.Msg.remove(req.body).then(function(result) {
            res.send('ok');
        }).catch(function(err) {
            res.send('error');
        });
    });
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