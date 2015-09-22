//// Main class ////////////////////
function FragmentTree(fragments) {

  this.fragHash = fragments.reduce(function(hash, fragment) {
    hash[fragment.id] = fragment;
    return hash;
  }, {});

  var rootNode = new TreeNode(null, Object.keys(this.fragHash));

  // Populate from root tree using leading substring of each fragment
  this.root = fragments.reduce(function(rootNode, fragment) {

    fragment.frontsubstr.reduce(function(parent, word) {

      var node = createOrAccessNode(parent.children, word);

      node.fragmentRefs.push(fragment.id);

      return node;

    }, rootNode);

    return rootNode;

  }, rootNode);
}

//// Methods ////////////////////
FragmentTree.prototype.search = function(fragment) {
  var words = fragment.backsubstr;
  var rootNode = this.root;

  var match = (function reduceWordSet(node, words) {
  
      if (words.length === 0) {
        return {ref: getRandomElement(node.fragmentRefs), words: []};
      }
  
      for (var i = 0; i < words.length; i++) {
        node = node.children[words[i]];
        if (!node) {
          return reduceWordSet(rootNode, words.slice(1));
        }
      }
      return {ref: getRandomElement(node.fragmentRefs), words: words};

    })(rootNode, words);

    match.fragment = this.fragHash[match.ref];

    return match;
};

//// Node class ///////////////////
function TreeNode(word, refs) {
  this.word = word;
  this.children = {};
  this.fragmentRefs = refs || [];
}

//// Helpers ////////////////////
function createOrAccessNode(object, word) {
  if (object[word] === undefined) {
    object[word] = new TreeNode(word);
  }
  return object[word];
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = FragmentTree;
