function FragmentTree(fragments) {

  this.fragHash = fragments.reduce(function(hash, fragment) {
    hash[fragment.id] = fragment;
    return hash;
  }, {});

  var rootNode = new TreeNode(null, Object.keys(this.fragHash));

  // Populate from root tree using leading substring of each fragment
  this.root = fragments.reduce(function(rootNode, fragment) {

    fragment.frontsubstr.reduce(function(parent, word) {

      var node = createOrAccessChild(parent.children, word);

      node.fragmentRefs.push(fragment.id);

      return node.children;

    }, rootNode);

    return rootNode;

  }, rootNode);
}

function TreeNode(word, refs) {
  this.word = word;
  this.children = {};
  this.fragmentRefs = refs || [];
}

function createOrAccessNode(object, word) {
  if (object[word] === undefined) {
    object[word] = new TreeNode(word);
  }
  return object[word];
}


function prefixTrieFromFragments(fragments) {
  var rootNode = {word: null, children: {}, fragmentRefs: []};

  return fragments.reduce(function(tree, fragment) {
    var substringArray = fragment.frontsubstr;
    
  }, rootNode);
  
}