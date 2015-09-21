var db = require("./db");

var Post = db.Model.extend({
  tableName: "posts",
  fragments: function() {
    return this.hasMany(Fragment);
  }
});

// Single authoritative collection
var Posts = new db.Collection;
Posts.model = Post;

var Fragment = db.Model.extend({
  tableName: "fragments"
});

// Single authoritative collection
var Fragments = new db.Collection;
Fragments.model = Fragment;

// Each time a post is added, split it into sentences and generate fragments
Posts.on("add", function(post) {

  var sentences = post.text.split(/[\.\n]/);

  var fragments = sentences.map(function(sentence) {
    return {
      frontsubstr: sentence.slice(0, 4).toJSON(),
      backsubstr: sentence.slice(-4).toJSON(),
      text: sentence,
      post_id: post.id
    }
  });

  Fragments.add(fragments);
});

var User = db.Model.extend({
  tableName: "users",
  posts: function() {
    return this.hasMany(Post);
  }
});

// Single authoritative collection
var Users = new db.Collection;
Users.model = User;

function insertUser(data) {
  return new User({name: data.username}).fetch()
    .then(function(user) {
      if (user) {
        throw new Error("User token already exists in database")
      }
      Users.create({name: data.username});
    });
}

function insertPost(data) {
  return new User({name: data.username}).fetch()
    .then(function(user) {
      if (!user) {
        throw new Error("User doesn't exist in database!");
      } else {
        return user.id;
      }
    })
    .then(function(userid) {
      // TODO: Generate fragments
      return Posts.create({text: data.text, user_id: userid})
    })
    .catch(function(err) {
      console.error("Error inserting post: ", err);
      return err;
    });
}

function getRecentFragments() {

}