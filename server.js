var express = require("express");
var morgan = require("morgan");
var bodyparser = require("body-parser");

var db = require("./db/dbinterface")
var app = express();

app.use(bodyparser.json());
app.use(morgan("dev"));

var apiRoutes = express.Router();

apiRoutes.route("/text")
  .get(function(req, res) {
    // TODO: database digest of current text state
    res.json(); 
  })
  .post(function(req, res) {
    // TODO: addition of text w/ identifier and message into database
    db.insertPost(req.body);
    console.log(req.body);
  });

apiRoutes.route("/text/:fragmentId")
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