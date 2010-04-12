new Test.Unit.Runner({
  setup: function() {
    $('content').update(
      "<strong id=\"lorem\">Lorem ipsum</strong> dolor sit amet, " +
      "<em id=\"consectetuer\">consectetuer</em> adipiscing elit."
    );

    $('wrapper').cleanWhitespace();

    this.range = document.createRange();
    this.range.selectNode($('content'));
  },

  testSetStart: function() {
    var runner = this;

    this.range.setStart($('content'), 2);
    this.range.setEnd($('content'), 2);

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(2, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "endContainer");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("", this.range.toString(), "toString");

    this.range.setStart($('lorem'), 0);
    this.range.setEnd($('lorem'), 1);

    runner.assertEqual($('lorem'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('lorem'), this.range.endContainer, "endContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('lorem'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum", this.range.toString(), "toString");
  },

  testSetEnd: function() {
    var runner = this;

    this.range.setStart($('content'), 1);
    this.range.setEnd($('content'), 2);

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual(" dolor sit amet, ", this.range.toString(), "toString");

    this.range.setStart($('consectetuer'), 0);
    this.range.setEnd($('consectetuer'), 1);

    runner.assertEqual($('consectetuer'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('consectetuer'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('consectetuer'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("consectetuer", this.range.toString(), "toString");
  },

  testSetStartBefore: function() {
    var runner = this;

    this.range.setStartBefore($('lorem'));
    this.range.setEnd($('content'), 2);

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "endContainer");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum dolor sit amet, ", this.range.toString(), "toString");

    this.range.setStartBefore($('content'));
    this.range.setEnd($('content'), 2);

    runner.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "endContainer");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum dolor sit amet, ", this.range.toString(), "toString");
  },

  testSetStartAfter: function() {
    var runner = this;

    this.range.setStartAfter($('lorem'));
    this.range.setEnd($('content'), 2);

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual(" dolor sit amet, ", this.range.toString(), "toString");

    this.range.setStartAfter($('content'));
    this.range.setEnd($('wrapper'), 1);

    runner.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("", this.range.toString(), "toString");
  },

  testSetEndBefore: function() {
    var runner = this;

    this.range.setStart($('content'), 0);
    this.range.setEndBefore($('lorem'));

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(0, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("", this.range.toString(), "toString");

    this.range.setStart($('wrapper'), 0);
    this.range.setEndBefore($('content'));

    runner.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
    runner.assertEqual(0, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("", this.range.toString(), "toString");
  },

  testSetEndAfter: function() {
    var runner = this;

    this.range.setStart($('content'), 0);
    this.range.setEndAfter($('lorem'));

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum", this.range.toString(), "toString");

    this.range.setStart($('content'), 0);
    this.range.setEndAfter($('content'));

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", this.range.toString(), "toString");
  },

  testCollapse: function() {
    var runner = this;

    this.range.setStart($('content'), 1);
    this.range.setEnd($('content'), 2);
    this.range.collapse(true);

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("", this.range.toString(), "toString");

    this.range.setStart($('content'), 1);
    this.range.setEnd($('content'), 2);
    this.range.collapse(false);

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(2, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("", this.range.toString(), "toString");
  },

  testSelectNode: function() {
    var runner = this;

    this.range.selectNode($('content'));

    runner.assertEqual($('wrapper'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('wrapper'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", this.range.toString(), "toString");

    this.range.selectNode($('lorem'));

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum", this.range.toString(), "toString");
  },

  testSelectNodeContents: function() {
    var runner = this;

    this.range.selectNodeContents($('content'));

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(4, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", this.range.toString(), "toString");

    this.range.selectNodeContents($('lorem'));

    runner.assertEqual($('lorem'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('lorem'), this.range.endContainer, "startContainer");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('lorem'), this.range.commonAncestorContainer, "commonAncestorContainer");
    runner.assertEqual("Lorem ipsum", this.range.toString(), "toString");
  },

  testDeleteContents: function() {
    var runner = this;

    this.range.selectNodeContents($('lorem'));
    this.range.deleteContents();

    runner.assertEqual("", $('lorem').innerHTML, "innerHTML");
  },

  testExtractContents: function() {
    var runner = this;

    this.range.selectNodeContents($('lorem'));
    var contents = this.range.extractContents();

    runner.assertEqual("", $('lorem').innerHTML, "innerHTML");

    //IE document does not have any useful methods. Everyone else can just
    // read textContent, IE needs to append the fragment to another element
    // and read its innerHTML
    if (contents.textContent) {
      runner.assertEqual("Lorem ipsum", contents.textContent, "textContent");
    } else {
      var e = new Element('div');
      e.appendChild(contents);
      runner.assertEqual("Lorem ipsum", e.innerHTML, "textContent");
    }
  },

  testCloneContents: function() {
    var runner = this;

    this.range.selectNodeContents($('lorem'));
    var contents = this.range.cloneContents();

    runner.assertEqual("Lorem ipsum", $('lorem').innerHTML, "innerHTML");

    // IE document does not have any useful methods. Everyone else can just
    // read textContent, IE needs to append the fragment to another element
    // and read its innerHTML
    if (contents.textContent) {
      runner.assertEqual("Lorem ipsum", contents.textContent, "textContent");
    } else {
      var e = new Element('div');
      e.appendChild(contents);
      runner.assertEqual("Lorem ipsum", e.innerHTML, "textContent");
    }
  },

  testInsertNode: function() {
    var runner = this;

    var node = new Element('span', {id: 'inserted'}).update("inserted!");

    this.range.selectNode($('lorem'));
    this.range.insertNode(node);

    runner.assertEqual("inserted!", $('inserted').innerHTML, "innerHTML");

    runner.assertEqual($('content'), this.range.startContainer, "startContainer");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual($('content'), this.range.endContainer, "startContainer");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer");
  },

  testSurrondContents: function() {
    var runner = this;

    var node;

    node = new Element('span', {id: 'wrapper'});

    this.range.selectNodeContents($('lorem'));
    this.range.surroundContents(node);

    expected = new Element('div');
    expected.appendChild(new Element('span', {id: 'wrapper'}).update("Lorem ipsum"));

    runner.assertEqual(expected.innerHTML, $('lorem').innerHTML, "innerHTML");
  },

  testEqualRange: function() {
    var runner = this;

    if (!this.range.equalRange) {
      runner.flunk("equalRange is not implemented");
      return false;
    }

    var r1 = document.createRange();
    r1.selectNodeContents($('lorem'));

    var r2 = document.createRange();
    r2.selectNodeContents($('lorem'));

    var r3 = document.createRange();
    r3.selectNodeContents($('consectetuer'));

    runner.assert(r1.equalRange(r1), "r1.equalRange(r1)");
    runner.assert(r2.equalRange(r2), "r2.equalRange(r2)");
    runner.assert(r3.equalRange(r3), "r3.equalRange(r3)");

    runner.assert(r1.equalRange(r2), "r1.equalRange(r2)");
    runner.assert(r2.equalRange(r1), "r2.equalRange(r1)");
    runner.assert(!r1.equalRange(r3), "r1.equalRange(r3)");
    runner.assert(!r3.equalRange(r1), "r3.equalRange(r1)");

    runner.assert(!r1.equalRange(null), "r1.equalRange(null)");
    runner.assert(!r2.equalRange(null), "r2.equalRange(null)");
    runner.assert(!r3.equalRange(null), "r3.equalRange(null)");
  },

  testGetNode: function() {
    var runner = this;

    if (!this.range.getNode) {
      runner.flunk("getNode is not implemented");
      return false;
    }

    this.range.selectNodeContents($('lorem'));
    runner.assertEqual($('lorem'), this.range.getNode(), "getNode");

    this.range.selectNode($('lorem'));
    runner.assertEqual($('lorem'), this.range.getNode(), "getNode");

    this.range.setStart($('lorem'), 0);
    this.range.setEnd($('lorem'), 1);
    runner.assertEqual($('lorem'), this.range.getNode(), "getNode");
  }
});
