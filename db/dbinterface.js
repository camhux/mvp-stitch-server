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
    var words = sentence.replace(/[^\w\s]/, "").split(" ");
    var frontsubstr = words.slice(0, 4).map( word => word.toLowerCase() );
    var backsubstr = words.slice(-4).map( word => word.toLowerCase() );
    var trimmed = words.slice((frontsubstr.length), -(backsubstr.length)).join(" ");
    return {
      frontsubstr: JSON.stringify(frontsubstr),
      backsubstr: JSON.stringify(backsubstr),
      trimmed: trimmed,
      raw: sentence,
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
    return sequenceFragments(fragments.toArray());
  }).then(function(sequence) {
    return stitchSequenceToText(sequence);
  });
  // .then(function(sequence){
  //   return sequence.map( fragment => fragment.get("text") );
  // });

  //// stitching helpers //////////////////////
  function sequenceFragments(fragments, sequence) {
    // TODO: messy logic here
    if (sequence === undefined) {
      sequence = [];
      if (fragments && fragments.length) {
        sequence.push(pluckRandom(fragments));
      }
    }

    if (fragments.length === 0) {
      return sequence;
    }

    var tree = new FragmentTree(fragments.map((fragment, i) => {
                                  fragment.attributes._index = i;
                                  return fragment.attributes;
                                }));

    var base = sequence[sequence.length - 1];
    var match = tree.search(base.attributes);
    base.matchedWords = match.words;
    sequence.push(pluck(fragments, match._index));
    return sequenceFragments(fragments, sequence);
  }

  function stitchSequenceToText(sequence) {
    console.log(sequence);
    if (!sequence.length) return "";
    return sequence.reduce(function(state, fragment) {
      var fragText;
      if (state.joinNext) {
        fragText = fragment.frontsubstr.join(" ") + fragment.trimmed;
      } else {
        // TODO: find way to use raw here
        fragText = fragment.frontsubstr.join(" ") + fragment.trimmed;
      }
      if (fragment.matchedWords.length === 0) {
        fragText += fragment.backsubstr.join(" ");
        state.joinNext = true;
      } else {
        fragText += fragment.matchedWords.join(" ")
        state.joinNext = false;
      }
      state.text += fragText;
      return state;
    }, {text: "", joinNext: false}).text;
  }

  function pluck(array, index) {
    var len = array.length;
    var temp = array[index];
    array[index] = array[len - 1];
    array[len - 1] = temp;
    return array.pop();
  }

  function pluckRandom(array) {
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
