var express = require("express");
var morgan = require("morgan");
var bodyparser = require("body-parser");

var db = require("./db/dbinterface")
var app = express();

app.use(bodyparser.json());
app.use(morgan("dev"));
app.use(express.static(__dirname + "client/build"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "client/index.html");
});

var apiRoutes = express.Router();

apiRoutes.route("/content")
  .get(function(req, res) {
    db.getContent().then(function(content) {
      res.json(content);
    });
  });

apiRoutes.route("/posts")
  .get(function(req, res) {
    // TODO: database digest of current text state
    db.getAllPosts().then(function(posts) {
      res.json(posts); 
    });
  })
  .post(function(req, res) {
    // TODO: addition of text w/ identifier and message into database
    db.insertPost(req.body)
      .then(function() {
        res.status(201).end();
      });
  });

apiRoutes.route("/fragments")
  .get(function(req, res) {
    db.getAllFragments().then(function(fragments) {
      res.json(fragments);
    });
  });

apiRoutes.route("/fragments/stitched")
  .get(function(req, res) {
    db.stitchPosts().then(function(sequence) {
      res.json(sequence);
    });
  });

apiRoutes.route("/fragments/:fragmentId")
  .get(function(req, res) {
    // TODO: use identifier of fragment to recover original context from db
    res.json();
  });

app.use("/api", apiRoutes);

var port = process.env.PORT || 1800

app.listen(port, function(err) {
  if (err) throw err;
  console.log("Server listening on ", port);
});