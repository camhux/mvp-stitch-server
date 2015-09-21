var knex = require("knex")({
  client: "pg",
  connection: require("./dbconfig")
});

var db = module.exports = require("bookshelf")(knex);

// Post Schema
  // Posts come in as text + user token
  // Text must be transformed into fragments using fragment schema
db.knex.schema.hasTable("posts").then(function(table) {
  if (!table) {
    return db.knex.schema.createTable("posts", function(post) {
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
db.knex.schema.hasTable("fragments").then(function(table) {
  if (!table) {
    return db.knex.schema.createTable("fragments", function(fragment) {
      fragment.uuid("id").primary();
      fragment.uuid("post_id").notNullable().references("id").inTable("posts");
      fragment.text("text").notNullable();
      fragment.specificType("frontsubstr", "text[4]").notNullable();
      fragment.specificType("backsubstr", "text[4]").notNullable();
    });
  }
})

// User Schema
  // Simple id-token association, for use as foreign key
db.knex.schema.hasTable("users").then(function(table) {
  if (!table) {
    return db.knex.schema.createTable("users", function(user) {
      user.uuid("id").primary();
      user.text("name").notNullable();
    });
  }
});