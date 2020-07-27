//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is a Blog webpage that works exactly as it should, you can add new blogs, check all the blogs on this homepage. IMPORTANT NOTE: This is the Version2 of the BlogWebpage and the data is not going to go anywhere since it is connected to a database internally.";
const aboutContent = "This has been developed by Mehul Raj. This was a challenge project and thus been developed. New Version with more functionalities will surely come!!";
const contactContent = "If you are viewing this, you most probably in my github account and thus feel free to ask as many questions you want, I will be really happy if I am able to answer to any of those queries.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB",{ useNewUrlParser: true , useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Blog = mongoose.model("Blog",postSchema);


app.get("/", function(req, res){

  Blog.find({},function(err,posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  })
    post.save();
    res.redirect("/");
});

app.get("/posts/:postid", function(req, res){
  const requestedId = req.params.postid;

  Blog.findOne({_id: requestedId},function(err,foundList){
    if(err){
      console.log(err);
    }else{
      res.render("post",{
        title: foundList.title,
        content: foundList.content
      });
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
