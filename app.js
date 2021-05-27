const express = require("express");
const app = express();
const port = require("./port");
const axios = require("axios");
const fs = require("fs");
const bodyParser = require("body-parser");
app.listen(port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", __dirname+'\\views');
app.use("/public", express.static(__dirname + "\\public"));

app.get("/", (req, res) => {
  var allnotes = fs.readdirSync(__dirname+"/notes");
  res.render("home", { allnotes });
});

app.get("/create", (req, res) => {
  var allnotes = fs.readdirSync(__dirname + "/notes");
  res.render("create", { allnotes, title: "" ,quilldelta:''});
});

app.post("/create", (req, res) => {
  var allnotes = fs.readdirSync(__dirname + "/notes");
  // console.log(JSON.stringify(req.body))
  if (req.body.title.trim() == "") {
    fs.writeFile(
      `./notes/untitled-${allnotes.length + 1}.txt`,
      JSON.stringify(req.body),
      () => {
        console.log("done.!");
      }
    );
  } else {
    fs.writeFile(__dirname+
      `/notes/${req.body.title.trim().split(" ").join("-")}.txt`,
      JSON.stringify(req.body),
      () => {
        // console.log("done.!");
      }
    );
  }
});


app.post('/delete',(req,res,next) => {
  fs.rmSync(__dirname+req.body.title  );

})



app.get("/notes/:title", (req, res) => {
  var allnotes = fs.readdirSync(__dirname + "/notes");

var title = req.params.title
  var data = JSON.parse(
    fs.readFileSync(__dirname + `\\notes\\${title}`).toString()
  );
  var quilldata = data.data
  quilldata = JSON.stringify(quilldata)
  res.render("create", {allnotes, title: data.title ,quilldelta:quilldata});
});
