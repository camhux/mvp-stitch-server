var bookshelf = require("./db");
var uuid = require("node-uuid");

var Post = bookshelf.Model.extend({
  tableName: "posts",
  fragments: function() {
    return this.hasMany(Fragment);
  }
});

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

// Each time a post is added, split it into sentences and generate fragments
Posts.on("add", function(post) {

  var sentences = post.text.split(/[\.\n]/);

  var fragments = sentences.map(function(sentence) {
    var words = sentence.split(" ")
    return {
      frontsubstr: words.slice(0, 4).toJSON(),
      backsubstr: words.slice(-4).toJSON(),
      text: sentence,
      post_id: post.id
    };
  });

  Fragments.add(fragments);
});

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
      // TODO: Generate fragments
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

module.exports = {
  insertPost,
  getAllPosts
}