new Test.Unit.Runner({
  setup: function() {
    $('content').update(
      "<strong id=\"lorem\">Lorem ipsum</strong> dolor sit amet, " +
      "<em id=\"consectetuer\">consectetuer</em> adipiscing elit."
    );

    this.selection = window.getSelection();
    this.selection.removeAllRanges();
  },

  testSelectNode: function() {
    var runner = this;

    this.selection.selectNode($('lorem'));

    runner.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
    runner.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
    runner.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
    runner.assertEqual(11, this.selection.focusOffset, "focusOffset");
    runner.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
    runner.assertEqual(1, this.selection.rangeCount, "rangeCount");

    // Webkit extensions
    if (this.selection.baseNode) {
      runner.assertEqual("Lorem ipsum", this.selection.baseNode.textContent, "baseNode.textContent");
      runner.assertEqual(0, this.selection.baseOffset, "baseOffset");
    }
    if (this.selection.extentNode) {
      runner.assertEqual("Lorem ipsum", this.selection.extentNode.textContent, "extentNode.textContent");
      runner.assertEqual(11, this.selection.extentOffset, "extentOffset");
    }
  },

  testCollapse: function() {
    var runner = this;

    this.selection.collapse($('lorem'), 0);

    runner.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
    runner.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
    runner.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
    runner.assertEqual(0, this.selection.focusOffset, "focusOffset");
    runner.assertEqual(true, this.selection.isCollapsed, "isCollapsed");
    runner.assertEqual(1, this.selection.rangeCount, "rangeCount");
  },

  testCollapseToStart: function() {
    var runner = this;

    range = document.createRange();
    range.selectNodeContents($('lorem'));
    this.selection.addRange(range);
    this.selection.collapseToStart();

    runner.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
    runner.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
    runner.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
    runner.assertEqual(0, this.selection.focusOffset, "focusOffset");
    runner.assertEqual(true, this.selection.isCollapsed, "isCollapsed");
    runner.assertEqual(1, this.selection.rangeCount, "rangeCount");
  },

  testCollapseToEnd: function() {
    var runner = this;

    range = document.createRange();
    range.selectNodeContents($('lorem'));
    this.selection.addRange(range);
    this.selection.collapseToEnd();

    runner.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
    runner.assertEqual(11, this.selection.anchorOffset, "anchorOffset");
    runner.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
    runner.assertEqual(11, this.selection.focusOffset, "focusOffset");
    runner.assertEqual(true, this.selection.isCollapsed, "isCollapsed");
    runner.assertEqual(1, this.selection.rangeCount, "rangeCount");
  },

  testSelectAllChildren: function() {
    var runner = this;

    this.selection.selectAllChildren($('lorem'));

    runner.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
    runner.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
    runner.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
    runner.assertEqual(11, this.selection.focusOffset, "focusOffset");
    runner.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
    runner.assertEqual(1, this.selection.rangeCount, "rangeCount");

    this.selection.selectAllChildren($('content'));

    runner.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
    runner.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
    runner.assertEqual(" adipiscing elit.", this.selection.focusNode.textContent, "focusNode.textContent");
    runner.assertEqual(17, this.selection.focusOffset, "focusOffset");
    runner.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
    runner.assertEqual(1, this.selection.rangeCount, "rangeCount");
  },

  testDeleteFromDocument: function() {
    var runner = this;

    range = document.createRange();
    range.selectNodeContents($('lorem'));
    this.selection.addRange(range);
    this.selection.deleteFromDocument();

    runner.assertEqual("", $('lorem').innerHTML);
  },

  testGetRangeAt: function() {
    var runner = this;

    range = document.createRange();
    range.selectNodeContents($('lorem'));
    this.selection.addRange(range);
    range = this.selection.getRangeAt(0);

    runner.assertEqual(Node.TEXT_NODE, range.startContainer.nodeType, "startContainer.nodeType");
    runner.assertEqual(null, range.startContainer.tagName, "startContainer.tagName");
    runner.assertEqual(0, range.startOffset, "startOffset");
    runner.assertEqual(Node.TEXT_NODE, range.endContainer.nodeType, "endContainer.nodeType");
    runner.assertEqual(null, range.endContainer.tagName, "endContainer.tagName");
    runner.assertEqual(11, range.endOffset, "endOffset");
    runner.assertEqual(false, range.collapsed, "collapsed");
    runner.assertEqual("Lorem ipsum", range.commonAncestorContainer.textContent, "commonAncestorContainer.textContent")
  },

  testSelectFocusNode: function() {
    var runner = this;

    var range = document.createRange();
    range.selectNodeContents($('lorem'));
    this.selection.addRange(range);
    this.selection.collapseToStart();

    var range = document.createRange();
    range.selectNode(this.selection.focusNode);
    this.selection.removeAllRanges();
    this.selection.addRange(range);

    runner.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
    runner.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
    runner.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
    runner.assertEqual(11, this.selection.focusOffset, "focusOffset");
    runner.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
    runner.assertEqual(1, this.selection.rangeCount, "rangeCount");
  }
});
