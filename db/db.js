var knex = require("knex")({
  client: "pg",
  connection: require("./dbconfig")
});

var bookshelf = module.exports = require("bookshelf")(knex);

bookshelf.clearDb = function() {
  this.knex.dropTableIfExists("posts");
  this.knex.dropTableIfExists("fragments");
  this.knex.dropTableIfExists("users");
}

// Post Schema
  // Posts come in as text + user token
  // Text must be transformed into fragments using fragment schema
bookshelf.knex.schema.hasTable("posts").then(function(table) {
  if (!table) {
    return bookshelf.knex.schema.createTable("posts", function(post) {
      post.uuid("id").primary();
      post.text("text").notNullable();
      post.uuid("user_id").notNullable().references("id").inTable("users");
      post.timestamp("created_at");
    });
  }
});

// Fragment Schema
  // Contains raw text of each fragment
  // Graph of word chains -- or is a simple substring match enough? How to make relationship efficient?
bookshelf.knex.schema.hasTable("fragments").then(function(table) {
  if (!table) {
    return bookshelf.knex.schema.createTable("fragments", function(fragment) {
      fragment.uuid("id").primary();
      fragment.uuid("post_id").notNullable().references("id").inTable("posts");
      fragment.text("text").notNullable();
      // Two JSON arrays of length 4 for front and rear substring searches
      fragment.json("frontsubstr").notNullable();
      fragment.json("backsubstr").notNullable();
    });
  }
})

// User Schema
  // Simple id-token association, for use as foreign key
bookshelf.knex.schema.hasTable("users").then(function(table) {
  if (!table) {
    return bookshelf.knex.schema.createTable("users", function(user) {
      user.uuid("id").primary();
      user.string("name").notNullable();
    });
  }
});