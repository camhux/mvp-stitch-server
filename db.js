var knex = require("knex")({
  client: "pg"
  connection: require('./dbconfig')
});

var db = module.exports = require("bookshelf")(knex);

// Post Schema
  // Posts come in as text + user token
  // Text must be transformed into fragments using fragment schema


// Fragment Schema
  // Contains raw text of each fragment
  // Graph of word chains -- or is a simple substring match enough? How to make relationship efficient?

// User Schema
  // Simple id-token association, for use as foreign key