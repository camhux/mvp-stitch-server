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
    // TODO: make lazier
    var words = sentence.toLowerCase().replace(/[^\w\s]/, "").split(" ");
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
var Posts = new bookshelf.Collection();
Posts.model = Post;

var Fragment = bookshelf.Model.extend({
  tableName: "fragments",
  post: function() {
    return this.belongsTo(Post);
  }
});

// Single authoritative collection
var Fragments = new bookshelf.Collection();
Fragments.model = Fragment;

var User = bookshelf.Model.extend({
  tableName: "users",
  posts: function() {
    return this.hasMany(Post);
  }
});

// Single authoritative collection
var Users = new bookshelf.Collection();
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
    return stitchReduce(fragments.toArray());
  })
  .then(function(sequence){
    return sequence.map( fragment => fragment.get("text") );
  });

  //// stitching helpers //////////////////////
  function stitchReduce(fragments, sequence) {
    if (sequence === undefined) {
      sequence = [];
      sequence.push(pluckRandom(fragments));
    }
    if (fragments.length === 0) {
      return sequence;
    }
    console.log(sequence);  

    var tree = new FragmentTree(fragments.map((fragment, i) => {
                                  fragment.attributes._index = i;
                                  return fragment.attributes;
                                }));

    var base = sequence[sequence.length - 1];
    var match = tree.search(base.attributes);
    sequence.push(pluck(fragments, match._index));
    return stitchReduce(fragments, sequence);
  }

  function pluck(array, index) {
    var len = array.length;
    var temp = array[index];
    array[index] = array[len - 1];
    array[len - 1] = temp;
    return array.pop();
  }

  function pluckRandom(array) {
    if (!array.length) return null;
    var randomIx = Math.floor(Math.random() * array.length);
    return pluck(array, randomIx);
  }
}

module.exports = {
  insertPost,
  getAllPosts,
  stitchPosts,
  getAllFragments
};
