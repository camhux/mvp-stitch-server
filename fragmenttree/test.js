var expect = require("chai").expect;
var FragmentTree = require(__dirname + "/fragmentTree.js");

function FragmentMock(words) {
  this.frontsubstr = words.slice(0, 4);
  this.id = Math.floor(Math.random() * 9999);
}

describe("Fragment tree", function() {

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

});