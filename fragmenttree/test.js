var expect = require("chai").expect;
var FragmentTree = require(__dirname + "/fragmentTree");

function FragmentMock(words) {
  this.frontsubstr = words.slice(0, 4);
  this.id = Math.floor(Math.random() * 9999);
}

describe("Fragment tree", function() {

  describe("Creation", function() {

    var fragments = [];

    fragments.push(new FragmentMock(["hi", "what's", "up", "kid"]));
    fragments.push(new FragmentMock(["hi", "what's", "up", "friend"]));
    fragments.push(new FragmentMock(["hi", "what's", "going", "on"]));

    it("should accept an array of fragments as an argument", function() {
      var tree = new FragmentTree(fragments);
      expect(tree).to.be.ok;
    });

    it("should return the root node of the tree", function() {
      var tree = new FragmentTree(fragments);
      expect(tree).to.be.an("object");
    });

    it("should have a traversable depth of 4", function() {
      var tree = new FragmentTree(fragments);
      var depth = 0;
      var node = tree.root;

      while (Object.keys(node.children).length !== 0) {
        node = node.children[Object.keys(node.children)[0]];
        depth += 1;
      }

      expect(depth).to.equal(4);

    });

  }); // Creation

  describe("Retrieval", function() {
    var fragments = [];

    fragments.push(new FragmentMock(["can", "barely", "handle", "it"]));
    fragments.push(new FragmentMock(["can", "barely", "deal", "with"]));
    fragments.push(new FragmentMock(["can", "only", "guess", "what"]));
    fragments.push(new FragmentMock(["who", "cought", "the", "wom"]));
    fragments.push(new FragmentMock(["who", "can", "believe", "it"]));

    var tree = new FragmentTree(fragments);

    it("should be able to dereference to a fragment from any child node", function() {
      var child = tree.root.children["can"].children["barely"].children["deal"];
      expect(tree.fragHash[child.fragmentRefs[0]]).to.be.an.instanceOf(FragmentMock);
    });

    it("should have a method called search", function() {
      expect(tree.search).to.be.a("function");
    });

    it("should use the argument to search to find an overlapping fragment", function() {
      var backsubstr = ["he", "can", "barely", "deal"];
      var fragment = {backsubstr: backsubstr};
      var match = tree.search(fragment);
      expect(match).to.be.an.instanceOf(FragmentMock);
      expect(match.frontsubstr).to.deep.equal(["can", "barely", "deal", "with"]);
    });

    it("should return a random fragment if there's no possible match", function() {
      var fragment = {backsubstr: ["what", "the", "hayell"]};
      var match = tree.search(fragment);
      expect(match).to.be.an.instanceOf(FragmentMock);
    });

  }); // Retrieval

}); // FragmentTree