var bookshelf = require("./db");
var uuid = require("node-uuid");
var FragmentTree = require("../fragmenttree/fragmentTree.js");

var Post = bookshelf.Model.extend({
  tableName: "posts",

  initialize: function() {
    this.on("created", generateFragments);
  },

  fragments: function() {
    return this.hasMany(Fragment);
  }
});

function generateFragments(post) {

  var sentences = post.get("text").split(/[\.\n]\s/);

  var fragments = sentences.map(function(sentence) {
    var words = sentence.split(" ");
    return {
      frontsubstr: JSON.stringify(words.slice(0, 4)),
      backsubstr: JSON.stringify(words.slice(-4)),
      text: sentence,
      post_id: post.get("id"),
      id: uuid.v1()
    };
  });

  fragments.forEach(function(fragment) {
    Fragments.create(fragment, {method: "insert"});
  });
}

// Single authoritative collection
var Posts = new bookshelf.Collection;
Posts.model = Post;

var Fragment = bookshelf.Model.extend({
  tableName: "fragments",
  post: function() {
    return this.belongsTo(Post);
  }
});

// Single authoritative collection
var Fragments = new bookshelf.Collection;
Fragments.model = Fragment;

var User = bookshelf.Model.extend({
  tableName: "users",
  posts: function() {
    return this.hasMany(Post);
  }
});

// Single authoritative collection
var Users = new bookshelf.Collection;
Users.model = User;

function insertPost(data) {
  return new User({name: data.username}).fetch()
    .then(function(user) {
      if (!user) {
        return Users.create({name: data.username, id: uuid.v1()}, {method: "insert"})
          .then(function(user) {
            return user.id;
          });
      } else {
        return user.id;
      }
    })
    .then(function(userid) {
      return Posts.create({text: data.text, user_id: userid, id: uuid.v1(), created_at: new Date().toISOString()}, {method: "insert"});
    })
    .catch(function(err) {
      console.error("Error inserting post: ", err);
      return err;
    });
}

function getAllPosts() {
  return Posts.fetch();
}

function getAllFragments() {
  return Fragments.fetch();
}

function stitchPosts(posts) {
  return getAllFragments().then(function(fragments) {
    console.log(fragments);
    return new FragmentTree(fragments.map( fragment => fragment.attributes ));
  })
  .then(function(tree) {
    console.log(tree);
    return tree;
  });
}

module.exports = {
  insertPost,
  getAllPosts,
  stitchPosts,
  getAllFragments
};
