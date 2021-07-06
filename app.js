// Wiki-API/app.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbName = process.env.DB_NAME
const appPort = process.env.APP_PORT

//const uri = "mongodb://" + dbHost + ":" + dbPort + "/" + dbName;
//const uri = "mongodb+srv://" + dbUser + ":" + dbPass + "@cluster0.25aqz.mongodb.net/" + dbName + "?retryWrites=true&w=majority";
const uri = "mongodb+srv://" + dbUser + ":" + dbPass + "@cluster0.25aqz.mongodb.net/" + dbName + "?retryWrites=true&w=majority";
console.log(uri);
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true });

let port = process.env.PORT;
if (port == null || port == "") { port = appPort; };
app.listen(port, function() { console.log("Server started on port: " + port); });

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles/:articleTitle")
  //Get a specific document
  .get((req,res)=>{
     //console.log(paramRoute);
     //res.send("Requested article: " + paramRoute);
     Article.findOne({title: req.params.articleTitle},(err,resultFound)=>{
       if (err) {
         res.send(err);
       } else if (resultFound) {
         res.send(resultFound);
       } else {
         res.send("No article found with the Title " +  req.params.articleTitle);
     }
   });
  })
  //Update a specific document - all fields
  .put((req,res)=>{
     //console.log("Update article (put): " + req.params.articleTitle);
     //console.log("Body: " + req.body.title + " " + req.body.content);
     Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overrite: true},
        (err,resultFound)=>{
       if (err) {
         res.send(err);
       } else if (resultFound) {
         res.send(resultFound);
       } else {
         res.send("No article found with the Title " + req.params.articleTitle);
     }
   });
  })
  //Update a specific document - specified fields
  .patch((req,res)=>{
     //console.log("Update article (patch): " + req.params.articleTitle);
     //console.log("Body: " + req.body);
     Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err,resultFound)=>{
       if (err) {
         res.send(err);
       } else if (resultFound) {
         res.send(resultFound);
       } else {
         res.send("No article found with the Title " + req.params.articleTitle);
     }
   });
  })
  //Delete a specific document
  .delete((req,res)=>{
     //console.log("Update article (patch): " + req.params.articleTitle);
     //console.log("Body: " + req.body);
     Article.deleteOne(
        {title: req.params.articleTitle},
        (err)=>{
       if (err) {
         res.send(err);
       } else {
         res.send("Article successfully deleted: " + req.params.articleTitle);
       }
     });
  });

app.route("/articles")
  //Create a new document
  .post((req,res)=>{
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    //console.log("Title: " + req.body.title);
    //console.log("Content: " + req.body.content);
    //console.log(newArticle);
    newArticle.save((err)=>{
      if (!err) {
        res.send("successfully added document.")
      } else {
        res.send(err);
      }
    });
  })
  //Get all the documents
  .get((req,res)=>{
    Article.find({},(err,foundArticles)=>{
      if (!err) {
        res.send(foundArticles);
      }
    });
  })
  //Delete all the documents
  .delete((req,res)=>{
    Article.deleteMany({},(err)=>{
      if (!err) {
        res.send("successfully deleted document(s).")
      } else {
        res.send(err);
      }
    });
  });
