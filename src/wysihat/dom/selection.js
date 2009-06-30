/** section: dom
 *  class WysiHat.Selection
**/
WysiHat.Selection = Class.create((function() {
  /**
   *  new WysiHat.Selection(editor)
   *  - editor (WysiHat.Editor): the editor object that you want to bind to
  **/
  function initialize(editor) {
    this.window = editor.getWindow();
    this.document = editor.getDocument();

    if (Prototype.Browser.IE) {
      editor.observe('wysihat:cursormove', saveRange.bind(this));
      editor.observe('wysihat:focus', restoreRange);
    }
  }

  /**
   *  WysiHat.Selection#getSelection() -> Selection
   *  Get selected text.
  **/
  function getSelection() {
    return this.window.getSelection ? this.window.getSelection() : this.document.selection;
  }

  /**
   *  WysiHat.Selection#getRange() -> Range
   *  Get range for selected text.
  **/
  function getRange() {
    var range = null, selection = this.getSelection();

    try {
      if (selection.getRangeAt)
        range = selection.getRangeAt(0);
      else
        range = selection.createRange();
    } catch(e) { return null; }

    if (Prototype.Browser.WebKit) {
      range.setStart(selection.baseNode, selection.baseOffset);
      range.setEnd(selection.extentNode, selection.extentOffset);
    }

    return range;
  }

  /**
   *  WysiHat.Selection#selectNode(node) -> undefined
   *  - node (Element): Element or node to select
  **/
  function selectNode(node) {
    var selection = this.getSelection();

    if (Prototype.Browser.IE) {
      var range = createRangeFromElement(this.document, node);
      range.select();
    } else if (Prototype.Browser.WebKit) {
      selection.setBaseAndExtent(node, 0, node, node.innerText.length);
    } else if (Prototype.Browser.Opera) {
      range = this.document.createRange();
      range.selectNode(node);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      var range = createRangeFromElement(this.document, node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /**
   *  WysiHat.Selection#getNode() -> Element
   *  Returns selected node.
  **/
  function getNode() {
    var nodes = null, candidates = [], children, el;
    var range = this.getRange();

    if (!range)
      return null;

    var parent;
    if (range.parentElement)
      parent = range.parentElement();
    else
      parent = range.commonAncestorContainer;

    if (parent) {
      while (parent.nodeType != 1) parent = parent.parentNode;
      if (parent.nodeName.toLowerCase() != "body") {
        el = parent;
        do {
          el = el.parentNode;
          candidates[candidates.length] = el;
        } while (el.nodeName.toLowerCase() != "body");
      }
      children = parent.all || parent.getElementsByTagName("*");
      for (var j = 0; j < children.length; j++)
        candidates[candidates.length] = children[j];
      nodes = [parent];
      for (var ii = 0, r2; ii < candidates.length; ii++) {
        r2 = createRangeFromElement(this.document, candidates[ii]);
        if (r2 && compareRanges(range, r2))
          nodes[nodes.length] = candidates[ii];
      }
    }

    return nodes.first();
  }

  function createRangeFromElement(document, node) {
    if (document.body.createTextRange) {
      var range = document.body.createTextRange();
      range.moveToElementText(node);
    } else if (document.createRange) {
      var range = document.createRange();
      range.selectNodeContents(node);
    }
    return range;
  }

  function compareRanges(r1, r2) {
    if (r1.compareEndPoints) {
      return !(
        r2.compareEndPoints('StartToStart', r1) == 1 &&
        r2.compareEndPoints('EndToEnd', r1) == 1 &&
        r2.compareEndPoints('StartToEnd', r1) == 1 &&
        r2.compareEndPoints('EndToStart', r1) == 1
        ||
        r2.compareEndPoints('StartToStart', r1) == -1 &&
        r2.compareEndPoints('EndToEnd', r1) == -1 &&
        r2.compareEndPoints('StartToEnd', r1) == -1 &&
        r2.compareEndPoints('EndToStart', r1) == -1
      );
    } else if (r1.compareBoundaryPoints) {
      return !(
        r2.compareBoundaryPoints(0, r1) == 1 &&
        r2.compareBoundaryPoints(2, r1) == 1 &&
        r2.compareBoundaryPoints(1, r1) == 1 &&
        r2.compareBoundaryPoints(3, r1) == 1
        ||
        r2.compareBoundaryPoints(0, r1) == -1 &&
        r2.compareBoundaryPoints(2, r1) == -1 &&
        r2.compareBoundaryPoints(1, r1) == -1 &&
        r2.compareBoundaryPoints(3, r1) == -1
      );
    }

    return null;
  };

  function setBookmark() {
    var bookmark = this.document.getElementById('bookmark');
    if (bookmark)
      bookmark.parentNode.removeChild(bookmark);

    bookmark = this.document.createElement('span');
    bookmark.id = 'bookmark';
    bookmark.innerHTML = '&nbsp;';

    if (Prototype.Browser.IE) {
      var range = this.document.selection.createRange();
      var parent = this.document.createElement('div');
      parent.appendChild(bookmark);
      range.collapse();
      range.pasteHTML(parent.innerHTML);
    }
    else {
      var range = this.getRange();
      range.insertNode(bookmark);
    }
  }

  function moveToBookmark() {
    var bookmark = this.document.getElementById('bookmark');
    if (!bookmark)
      return;

    if (Prototype.Browser.IE) {
      var range = this.getRange();
      range.moveToElementText(bookmark);
      range.collapse();
      range.select();
    } else if (Prototype.Browser.WebKit) {
      var selection = this.getSelection();
      selection.setBaseAndExtent(bookmark, 0, bookmark, 0);
    } else {
      var range = this.getRange();
      range.setStartBefore(bookmark);
    }

    bookmark.parentNode.removeChild(bookmark);
  }

  var savedRange = null;
  function saveRange() {
    savedRange = this.getRange();
  }

  function restoreRange() {
    if (savedRange) savedRange.select();
  }

  return {
    initialize:     initialize,
    getSelection:   getSelection,
    getRange:       getRange,
    getNode:        getNode,
    selectNode:     selectNode,
    setBookmark:    setBookmark,
    moveToBookmark: moveToBookmark,
    restore:        restoreRange
  };
})());
