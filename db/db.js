var knex = require("knex")({
  client: "pg",
  connection: require("./dbconfig")
});

var bookshelf = module.exports = require("bookshelf")(knex);

bookshelf.clearDb = function() {
  return bookshelf.knex.schema.dropTableIfExists("fragments")
    .then(function() {
      return bookshelf.knex.schema.dropTableIfExists("posts");
    })
    .then(function() {
      return bookshelf.knex.schema.dropTableIfExists("users");
    })
    .then(function() {
      console.log("Dropped all tables");
    });
};


if (process.env.NODE_ENV === "development") {
  bookshelf.clearDb().then(function() {
    init();
  });
} else {
  init();
}

function init() {

  // User Schema
    // Simple id-token association, for use as foreign key
  bookshelf.knex.schema.hasTable("users").then(function(table) {
    if (!table) {
      return bookshelf.knex.schema.createTable("users", function(user) {
        user.uuid("id").primary();
        user.string("name").notNullable().unique();
      });
    }
  })
  .then(function() {
    // Post Schema
      // Posts come in as text + user token
      // Text must be transformed into fragments using fragment schema
    return bookshelf.knex.schema.hasTable("posts").then(function(table) {
      if (!table) {
        return bookshelf.knex.schema.createTable("posts", function(post) {
          post.uuid("id").primary();
          post.text("text").notNullable();
          post.uuid("user_id").notNullable().references("id").inTable("users");
          post.timestamp("created_at");
        });
      }
    });
  })
  .then(function() {
    // Fragment Schema
      // Contains raw text of each fragment
      // Graph of word chains -- or is a simple substring match enough? How to make relationship efficient?
    return bookshelf.knex.schema.hasTable("fragments").then(function(table) {
      if (!table) {
        return bookshelf.knex.schema.createTable("fragments", function(fragment) {
          fragment.uuid("id").primary();
          fragment.uuid("post_id").notNullable().references("id").inTable("posts");
          fragment.text("raw").notNullable();
          fragment.text("trimmed").notNullable();
          // Two JSON arrays of length 4 for front and rear substring searches
          fragment.json("frontsubstr").notNullable();
          fragment.json("backsubstr").notNullable();
        });
      }
    });
  });
}
