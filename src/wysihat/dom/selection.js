/** section: dom
 *  class WysiHat.Selection
**/
WysiHat.Selection = Class.create((function() {
  /**
   *  new WysiHat.Selection(editor)
   *  - editor (WysiHat.Editor): the editor object that you want to bind to
  **/
  function initialize(editor) {
  }

  /**
   *  WysiHat.Selection#getSelection() -> Selection
   *  Get selected text.
  **/
  function getSelection() {
    return Prototype.Browser.IE ? document.selection : window.getSelection();
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
      var range = createRangeFromElement(document, node);
      range.select();
    } else if (Prototype.Browser.WebKit) {
      selection.setBaseAndExtent(node, 0, node, node.innerText.length);
    } else if (Prototype.Browser.Opera) {
      range = document.createRange();
      range.selectNode(node);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      var range = createRangeFromElement(document, node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /**
   *  WysiHat.Selection#getNode() -> Element
   *  Returns selected node.
  **/
  function getNode() {
    if (Prototype.Browser.IE) {
      var range = this.getRange();
      return range.parentElement();
    } else {
      var selection = window.getSelection();
      return selection.getRangeAt(0).getNode();
    }
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
    var bookmark = document.getElementById('bookmark');
    if (bookmark)
      bookmark.parentNode.removeChild(bookmark);

    bookmark = document.createElement('span');
    bookmark.id = 'bookmark';
    bookmark.innerHTML = '&nbsp;';

    if (Prototype.Browser.IE) {
      var range = document.selection.createRange();
      var parent = document.createElement('div');
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
    var bookmark = document.getElementById('bookmark');
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

  return {
    initialize:     initialize,
    getSelection:   getSelection,
    getRange:       getRange,
    getNode:        getNode,
    selectNode:     selectNode,
    setBookmark:    setBookmark,
    moveToBookmark: moveToBookmark,
    previousRange:  null
  };
})());
