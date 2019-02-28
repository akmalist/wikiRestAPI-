//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////Request targeting all Articles////////////////////////
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
          res.send(err);
      }
  });
})
.post(function(req,res){

// Create DB in Mongo website using   using mongoose
   const newArticles = new Article({
      title: req.body.title,
      content: req.body.content
  });

  //make post request using Postman tool
  newArticles.save(function(err){
    if(!err){
      res.send("Succesfully added New Article to Database");
    }else{
      res.send(err);
    }
  });
})
//delete articles via Postman
.delete(function(req,res){
Article.deleteMany(function(err){
  if(!err){
  res.send("Succesfully deleted articles");
  }else {
    res.send(err);
  }
});
});

///////////////////////////////Request targeting a specific Articles////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
   Article.findOne({title:req.params.articleTitle}, function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle); //send back from the server

    }else{
       res.send("No articles matching that title was found");
    }
  });
})

.put(function(req,res){
  //update from CRUD using mongoose
    Article.update({title:req.params.articleTitle},
      {title: req.body.title, content:req.body.content},
      {overwrite:true},//in order to change mongoDB default behavior
      function(err){
        if(!err){
          res.send("Succesfully updated the Aticles");
        }
      }
    );
})
//update a specific field
.patch(function(req, res) {
  Article.update({
      title: req.params.articleTitle
    }, {
      $set: req.body
    },
    function(err) {
      if (!err) {
        res.send("Succesfully updated a specific field in the article");
      } else {
        res.send(err);
      }
    }
  );
})
.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle},
    function(err){
    if(!err){
      res.send("Succesfully delete a specific Aticles");
    }else{
      res.send(err);
    }
  }
);
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
