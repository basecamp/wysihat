function setup() {
  $('content').update(
    "<strong id=\"lorem\">Lorem ipsum</strong> dolor sit amet, " +
    "<em id=\"consectetuer\">consectetuer</em> adipiscing elit."
  );

  this.selection = window.getSelection();
  this.selection.removeAllRanges();
}

test("selectNode", function() {
  setup.bind(this)();

  this.selection.selectNode($('lorem'));

  this.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
  this.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
  this.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
  this.assertEqual(11, this.selection.focusOffset, "focusOffset");
  this.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
  this.assertEqual(1, this.selection.rangeCount, "rangeCount");

  // Webkit extensions
  if (this.selection.baseNode) {
    this.assertEqual("Lorem ipsum", this.selection.baseNode.textContent, "baseNode.textContent");
    this.assertEqual(0, this.selection.baseOffset, "baseOffset");
  }
  if (this.selection.extentNode) {
    this.assertEqual("Lorem ipsum", this.selection.extentNode.textContent, "extentNode.textContent");
    this.assertEqual(11, this.selection.extentOffset, "extentOffset");
  }
});

test("Collapse", function() {
  setup.bind(this)();

  this.selection.collapse($('lorem'), 0);

  this.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
  this.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
  this.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
  this.assertEqual(0, this.selection.focusOffset, "focusOffset");
  this.assertEqual(true, this.selection.isCollapsed, "isCollapsed");
  this.assertEqual(1, this.selection.rangeCount, "rangeCount");
});

test("CollapseToStart", function() {
  setup.bind(this)();

  range = document.createRange();
  range.selectNodeContents($('lorem'));
  this.selection.addRange(range);
  this.selection.collapseToStart();

  this.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
  this.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
  this.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
  this.assertEqual(0, this.selection.focusOffset, "focusOffset");
  this.assertEqual(true, this.selection.isCollapsed, "isCollapsed");
  this.assertEqual(1, this.selection.rangeCount, "rangeCount");
});

test("CollapseToEnd", function() {
  setup.bind(this)();

  range = document.createRange();
  range.selectNodeContents($('lorem'));
  this.selection.addRange(range);
  this.selection.collapseToEnd();

  this.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
  this.assertEqual(11, this.selection.anchorOffset, "anchorOffset");
  this.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
  this.assertEqual(11, this.selection.focusOffset, "focusOffset");
  this.assertEqual(true, this.selection.isCollapsed, "isCollapsed");
  this.assertEqual(1, this.selection.rangeCount, "rangeCount");
});

test("SelectAllChildren", function() {
  setup.bind(this)();

  this.selection.selectAllChildren($('lorem'));

  this.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
  this.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
  this.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
  this.assertEqual(11, this.selection.focusOffset, "focusOffset");
  this.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
  this.assertEqual(1, this.selection.rangeCount, "rangeCount");

  this.selection.selectAllChildren($('content'));

  this.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
  this.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
  this.assertEqual(" adipiscing elit.", this.selection.focusNode.textContent, "focusNode.textContent");
  this.assertEqual(17, this.selection.focusOffset, "focusOffset");
  this.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
  this.assertEqual(1, this.selection.rangeCount, "rangeCount");
});

test("DeleteFromDocument", function() {
  setup.bind(this)();

  range = document.createRange();
  range.selectNodeContents($('lorem'));
  this.selection.addRange(range);
  this.selection.deleteFromDocument();

  this.assertEqual("", $('lorem').innerHTML);
});

test("GetRangeAt", function() {
  setup.bind(this)();

  range = document.createRange();
  range.selectNodeContents($('lorem'));
  this.selection.addRange(range);
  range = this.selection.getRangeAt(0);

  this.assertEqual(Node.TEXT_NODE, range.startContainer.nodeType, "startContainer.nodeType");
  this.assertEqual(null, range.startContainer.tagName, "startContainer.tagName");
  this.assertEqual(0, range.startOffset, "startOffset");
  this.assertEqual(Node.TEXT_NODE, range.endContainer.nodeType, "endContainer.nodeType");
  this.assertEqual(null, range.endContainer.tagName, "endContainer.tagName");
  this.assertEqual(11, range.endOffset, "endOffset");
  this.assertEqual(false, range.collapsed, "collapsed");
  this.assertEqual("Lorem ipsum", range.commonAncestorContainer.textContent, "commonAncestorContainer.textContent")
});

test("SelectFocusNode", function() {
  setup.bind(this)();

  var range = document.createRange();
  range.selectNodeContents($('lorem'));
  this.selection.addRange(range);
  this.selection.collapseToStart();

  var range = document.createRange();
  range.selectNode(this.selection.focusNode);
  this.selection.removeAllRanges();
  this.selection.addRange(range);

  this.assertEqual("Lorem ipsum", this.selection.anchorNode.textContent, "anchorNode.textContent");
  this.assertEqual(0, this.selection.anchorOffset, "anchorOffset");
  this.assertEqual("Lorem ipsum", this.selection.focusNode.textContent, "focusNode.textContent");
  this.assertEqual(11, this.selection.focusOffset, "focusOffset");
  this.assertEqual(false, this.selection.isCollapsed, "isCollapsed");
  this.assertEqual(1, this.selection.rangeCount, "rangeCount");
});
