function setup() {
  $('content').update(
    "<strong id=\"lorem\">Lorem ipsum</strong> dolor sit amet, " +
    "<em id=\"consectetuer\">consectetuer</em> adipiscing elit."
  );

  $('wrapper').cleanWhitespace();

  this.range = document.createRange();
  this.range.selectNode($('content'));
}

test("SetStart", function() {
  setup.bind(this)();

  this.range.setStart($('content'), 2);
  this.range.setEnd($('content'), 2);

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(2, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "endContainer");
  this.assertEqual(2, this.range.endOffset, "endOffset");
  this.assertEqual(true, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("", this.range.toString(), "toString");

  this.range.setStart($('lorem'), 0);
  this.range.setEnd($('lorem'), 1);

  this.assertEqual($('lorem'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('lorem'), this.range.endContainer, "endContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('lorem'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum", this.range.toString(), "toString");
});

test("SetEnd", function() {
  setup.bind(this)();

  this.range.setStart($('content'), 1);
  this.range.setEnd($('content'), 2);

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(1, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(2, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual(" dolor sit amet, ", this.range.toString(), "toString");

  this.range.setStart($('consectetuer'), 0);
  this.range.setEnd($('consectetuer'), 1);

  this.assertEqual($('consectetuer'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('consectetuer'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('consectetuer'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("consectetuer", this.range.toString(), "toString");
});

test("SetStartBefore", function() {
  setup.bind(this)();

  this.range.setStartBefore($('lorem'));
  this.range.setEnd($('content'), 2);

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "endContainer");
  this.assertEqual(2, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum dolor sit amet, ", this.range.toString(), "toString");

  this.range.setStartBefore($('content'));
  this.range.setEnd($('content'), 2);

  this.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "endContainer");
  this.assertEqual(2, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum dolor sit amet, ", this.range.toString(), "toString");
});

test("SetStartAfter", function() {
  setup.bind(this)();

  this.range.setStartAfter($('lorem'));
  this.range.setEnd($('content'), 2);

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(1, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(2, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual(" dolor sit amet, ", this.range.toString(), "toString");

  this.range.setStartAfter($('content'));
  this.range.setEnd($('wrapper'), 1);

  this.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
  this.assertEqual(1, this.range.startOffset, "startOffset");
  this.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(true, this.range.collapsed, "collapsed");
  this.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("", this.range.toString(), "toString");
});

test("SetEndBefore", function() {
  setup.bind(this)();

  this.range.setStart($('content'), 0);
  this.range.setEndBefore($('lorem'));

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(0, this.range.endOffset, "endOffset");
  this.assertEqual(true, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("", this.range.toString(), "toString");

  this.range.setStart($('wrapper'), 0);
  this.range.setEndBefore($('content'));

  this.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
  this.assertEqual(0, this.range.endOffset, "endOffset");
  this.assertEqual(true, this.range.collapsed, "collapsed");
  this.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("", this.range.toString(), "toString");
});

test("SetEndAfter", function() {
  setup.bind(this)();

  this.range.setStart($('content'), 0);
  this.range.setEndAfter($('lorem'));

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum", this.range.toString(), "toString");

  this.range.setStart($('content'), 0);
  this.range.setEndAfter($('content'));

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", this.range.toString(), "toString");
});

test("Collapse", function() {
  setup.bind(this)();

  this.range.setStart($('content'), 1);
  this.range.setEnd($('content'), 2);
  this.range.collapse(true);

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(1, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(true, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("", this.range.toString(), "toString");

  this.range.setStart($('content'), 1);
  this.range.setEnd($('content'), 2);
  this.range.collapse(false);

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(2, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(2, this.range.endOffset, "endOffset");
  this.assertEqual(true, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("", this.range.toString(), "toString");
});

test("SelectNode", function() {
  setup.bind(this)();

  this.range.selectNode($('content'));

  this.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", this.range.toString(), "toString");

  this.range.selectNode($('lorem'));

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum", this.range.toString(), "toString");
});

test("SelectNodeContents", function() {
  setup.bind(this)();

  this.range.selectNodeContents($('content'));

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(4, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", this.range.toString(), "toString");

  this.range.selectNodeContents($('lorem'));

  this.assertEqual($('lorem'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('lorem'), this.range.endContainer, "startContainer");
  this.assertEqual(1, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('lorem'), this.range.commonAncestorContainer, "commonAncestorContainer");
  this.assertEqual("Lorem ipsum", this.range.toString(), "toString");
});

test("DeleteContents", function() {
  setup.bind(this)();

  this.range.selectNodeContents($('lorem'));
  this.range.deleteContents();

  this.assertEqual("", $('lorem').innerHTML, "innerHTML");
});

test("ExtractContents", function() {
  setup.bind(this)();

  this.range.selectNodeContents($('lorem'));
  var contents = this.range.extractContents();

  this.assertEqual("", $('lorem').innerHTML, "innerHTML");

  //IE document does not have any useful methods. Everyone else can just
  // read textContent, IE needs to append the fragment to another element
  // and read its innerHTML
  if (contents.textContent) {
    this.assertEqual("Lorem ipsum", contents.textContent, "textContent");
  } else {
    var e = new Element('div');
    e.appendChild(contents);
    this.assertEqual("Lorem ipsum", e.innerHTML, "textContent");
  }
});

test("CloneContents", function() {
  setup.bind(this)();

  this.range.selectNodeContents($('lorem'));
  var contents = this.range.cloneContents();

  this.assertEqual("Lorem ipsum", $('lorem').innerHTML, "innerHTML");

  // IE document does not have any useful methods. Everyone else can just
  // read textContent, IE needs to append the fragment to another element
  // and read its innerHTML
  if (contents.textContent) {
    this.assertEqual("Lorem ipsum", contents.textContent, "textContent");
  } else {
    var e = new Element('div');
    e.appendChild(contents);
    this.assertEqual("Lorem ipsum", e.innerHTML, "textContent");
  }
});

test("InsertNode", function() {
  setup.bind(this)();

  var node = new Element('span', {id: 'inserted'}).update("inserted!");

  this.range.selectNode($('lorem'));
  this.range.insertNode(node);

  this.assertEqual("inserted!", $('inserted').innerHTML, "innerHTML");

  this.assertEqual($('content'), this.range.startContainer, "startContainer");
  this.assertEqual(0, this.range.startOffset, "startOffset");
  this.assertEqual($('content'), this.range.endContainer, "startContainer");
  this.assertEqual(2, this.range.endOffset, "endOffset");
  this.assertEqual(false, this.range.collapsed, "collapsed");
  this.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
});

test("SurrondContents", function() {
  setup.bind(this)();

  var node;

  node = new Element('span', {id: 'wrapper'});

  this.range.selectNodeContents($('lorem'));
  this.range.surroundContents(node);

  expected = new Element('div');
  expected.appendChild(new Element('span', {id: 'wrapper'}).update("Lorem ipsum"));

  this.assertEqual(expected.innerHTML, $('lorem').innerHTML, "innerHTML");
});

test("EqualRange", function() {
  setup.bind(this)();

  if (!this.range.equalRange) {
    this.flunk("equalRange is not implemented");
    return false;
  }

  var r1 = document.createRange();
  r1.selectNodeContents($('lorem'));

  var r2 = document.createRange();
  r2.selectNodeContents($('lorem'));

  var r3 = document.createRange();
  r3.selectNodeContents($('consectetuer'));

  this.assert(r1.equalRange(r1), "r1.equalRange(r1)");
  this.assert(r2.equalRange(r2), "r2.equalRange(r2)");
  this.assert(r3.equalRange(r3), "r3.equalRange(r3)");

  this.assert(r1.equalRange(r2), "r1.equalRange(r2)");
  this.assert(r2.equalRange(r1), "r2.equalRange(r1)");
  this.assert(!r1.equalRange(r3), "r1.equalRange(r3)");
  this.assert(!r3.equalRange(r1), "r3.equalRange(r1)");

  this.assert(!r1.equalRange(null), "r1.equalRange(null)");
  this.assert(!r2.equalRange(null), "r2.equalRange(null)");
  this.assert(!r3.equalRange(null), "r3.equalRange(null)");
});

test("GetNode", function() {
  setup.bind(this)();

  if (!this.range.getNode) {
    this.flunk("getNode is not implemented");
    return false;
  }

  this.range.selectNodeContents($('lorem'));
  this.assertEqual($('lorem'), this.range.getNode(), "getNode");

  this.range.selectNode($('lorem'));
  this.assertEqual($('lorem'), this.range.getNode(), "getNode");

  this.range.setStart($('lorem'), 0);
  this.range.setEnd($('lorem'), 1);
  this.assertEqual($('lorem'), this.range.getNode(), "getNode");
});
