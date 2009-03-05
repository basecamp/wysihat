new Test.Unit.Runner({
  setup: function() {
    $('content').update(
      "<strong id=\"lorem\">Lorem ipsum</strong> dolor sit amet, " +
      "<em id=\"consectetuer\">consectetuer</em> adipiscing elit."
    );

    var range = document.createRange();
    range.selectNode($('content'));

    var selection = window.getSelection();
    selection.removeAllRanges();

    if (Prototype.Browser.IE)
      selection._addRange(range); // IE
    else
      selection.addRange(range); // W3C

    if (selection.getRangeAt)
      this.range = selection.getRangeAt(0); // W3C
    else
      this.range = new Range(document); // IE
  },

  testSetStart: function() {
    var runner = this;

    this.range.setStart($('content'), 2);
    this.range.setEnd($('content'), 2);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(2, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer")

    this.range.setStart($('lorem'), 0);
    this.range.setEnd($('lorem'), 1);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("STRONG", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("STRONG", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('lorem'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testSetEnd: function() {
    var runner = this;

    this.range.setStart($('content'), 1);
    this.range.setEnd($('content'), 2);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer")

    this.range.setStart($('consectetuer'), 0);
    this.range.setEnd($('consectetuer'), 1);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("EM", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("EM", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('consectetuer'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testSetStartBefore: function() {
    var runner = this;

    this.range.setStartBefore($('content'));
    this.range.setEnd($('content'), 2);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testSetStartAfter: function() {
    var runner = this;

    this.range.setStartAfter($('content'));
    this.range.setEnd($('content'), 2);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(2, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testSetEndBefore: function() {
    var runner = this;

    this.range.setStart($('content'), 0);
    this.range.setEndBefore($('content'));

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testSetEndAfter: function() {
    var runner = this;

    this.range.setStart($('content'), 1);
    this.range.setEndAfter($('content'));

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('wrapper'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testCollapse: function() {
    var runner = this;

    this.range.setStart($('content'), 1);
    this.range.setEnd($('content'), 2);
    this.range.collapse(true);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(1, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer")

    this.range.setStart($('content'), 1);
    this.range.setEnd($('content'), 2);
    this.range.collapse(false);

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(2, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(2, this.range.endOffset, "endOffset");
    runner.assertEqual(true, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testSelectNode: function() {
    var runner = this;

    this.range.selectNode($('lorem'));

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("DIV", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("DIV", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('content'), this.range.commonAncestorContainer, "commonAncestorContainer")
  },

  testSelectNodeContents: function() {
    var runner = this;

    this.range.selectNodeContents($('lorem'));

    runner.assertEqual(Node.ELEMENT_NODE, this.range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual("STRONG", this.range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(0, this.range.startOffset, "startOffset");
    runner.assertEqual(Node.ELEMENT_NODE, this.range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual("STRONG", this.range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(1, this.range.endOffset, "endOffset");
    runner.assertEqual(false, this.range.collapsed, "collapsed");
    runner.assertEqual($('lorem'), this.range.commonAncestorContainer, "commonAncestorContainer")
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
  },

  testSurrondContents: function() {
    var runner = this;

    var node = new Element('span', {id: 'wrapper'});

    this.range.selectNodeContents($('lorem'));
    this.range.surroundContents(node);

    var expected;
    if (Prototype.Browser.IE)
      expected = "<SPAN id=wrapper>Lorem ipsum</SPAN>";
    else
      expected = "<span id=\"wrapper\">Lorem ipsum</span>";

    runner.assertEqual(expected, $('lorem').innerHTML, "innerHTML");
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

    this.range.selectNodeContents($('content'));
    this.range.collapse(true);
    runner.assertEqual($('lorem'), this.range.getNode(), "getNode");
  }
});
