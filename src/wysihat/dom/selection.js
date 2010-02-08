//= require "range"

if (!window.getSelection) {
  /** IE Selection class
   *
   *  Original created by Tim Cameron Ryan
   *    http://github.com/timcameronryan/IERange
   *  Copyright (c) 2009 Tim Cameron Ryan
   *  Released under the MIT/X License
   *
   *  Modified by Joshua Peek
  **/
  window.getSelection = (function() {
    var DOMUtils = {
      findChildPosition: function(node) {
        for (var i = 0; node = node.previousSibling; i++)
          continue;
        return i;
      },
      isDataNode: function(node) {
        return node && node.nodeValue !== null && node.data !== null;
      },
      isAncestorOf: function(parent, node) {
        return !DOMUtils.isDataNode(parent) &&
            (parent.contains(DOMUtils.isDataNode(node) ? node.parentNode : node) ||
            node.parentNode == parent);
      },
      isAncestorOrSelf: function(root, node) {
        return DOMUtils.isAncestorOf(root, node) || root == node;
      },
      findClosestAncestor: function(root, node) {
        if (DOMUtils.isAncestorOf(root, node))
          while (node && node.parentNode != root)
            node = node.parentNode;
        return node;
      },
      getNodeLength: function(node) {
        return DOMUtils.isDataNode(node) ? node.length : node.childNodes.length;
      },
      splitDataNode: function(node, offset) {
        if (!DOMUtils.isDataNode(node))
          return false;
        var newNode = node.cloneNode(false);
        node.deleteData(offset, node.length);
        newNode.deleteData(0, offset);
        node.parentNode.insertBefore(newNode, node.nextSibling);
      }
    };

    var TextRangeUtils = {
      convertToDOMRange: function(textRange, document) {
        function adoptBoundary(domRange, textRange, bStart) {
          // iterate backwards through parent element to find anchor location
          var cursorNode = document.createElement('a'), cursor = textRange.duplicate();
          cursor.collapse(bStart);
          var parent = cursor.parentElement();
          do {
            parent.insertBefore(cursorNode, cursorNode.previousSibling);
            cursor.moveToElementText(cursorNode);
          } while (cursor.compareEndPoints(bStart ? 'StartToStart' : 'StartToEnd', textRange) > 0 && cursorNode.previousSibling);

          // when we exceed or meet the cursor, we've found the node
          if (cursor.compareEndPoints(bStart ? 'StartToStart' : 'StartToEnd', textRange) == -1 && cursorNode.nextSibling) {
            // data node
            cursor.setEndPoint(bStart ? 'EndToStart' : 'EndToEnd', textRange);
            domRange[bStart ? 'setStart' : 'setEnd'](cursorNode.nextSibling, cursor.text.length);
          } else {
            // element
            domRange[bStart ? 'setStartBefore' : 'setEndBefore'](cursorNode);
          }
          cursorNode.parentNode.removeChild(cursorNode);
        }

        // return a DOM range
        var domRange = new Range(document);
        adoptBoundary(domRange, textRange, true);
        adoptBoundary(domRange, textRange, false);
        return domRange;
      },
      convertFromDOMRange: function(domRange) {
        function adoptEndPoint(textRange, domRange, bStart) {
          // find anchor node and offset
          var container = domRange[bStart ? 'startContainer' : 'endContainer'];
          var offset = domRange[bStart ? 'startOffset' : 'endOffset'], textOffset = 0;
          var anchorNode = DOMUtils.isDataNode(container) ? container : container.childNodes[offset];
          var anchorParent = DOMUtils.isDataNode(container) ? container.parentNode : container;
          // visible data nodes need a text offset
          if (container.nodeType == 3 || container.nodeType == 4)
            textOffset = offset;

          // create a cursor element node to position range (since we can't select text nodes)
          var cursorNode = domRange._document.createElement('a');
          anchorParent.insertBefore(cursorNode, anchorNode);
          var cursor = domRange._document.body.createTextRange();
          cursor.moveToElementText(cursorNode);
          cursorNode.parentNode.removeChild(cursorNode);
          // move range
          textRange.setEndPoint(bStart ? 'StartToStart' : 'EndToStart', cursor);
          textRange[bStart ? 'moveStart' : 'moveEnd']('character', textOffset);
        }

        // return an IE text range
        var textRange = domRange._document.body.createTextRange();
        adoptEndPoint(textRange, domRange, true);
        adoptEndPoint(textRange, domRange, false);
        return textRange;
      }
    };

    function Selection(document) {
      this._document = document;

      var selection = this;
      document.attachEvent('onselectionchange', function() {
        selection._selectionChangeHandler();
      });
    }

    Selection.prototype = {
      rangeCount: 0,
      _document: null,

      _selectionChangeHandler: function() {
        this.rangeCount = this._selectionExists(this._document.selection.createRange()) ? 1 : 0;
      },
      _selectionExists: function(textRange) {
        return textRange.compareEndPoints('StartToEnd', textRange) != 0 ||
            textRange.parentElement().isContentEditable;
      },
      addRange: function(range) {
        var selection = this._document.selection.createRange(), textRange = TextRangeUtils.convertFromDOMRange(range);
        if (!this._selectionExists(selection)) {
          textRange.select();
        } else {
          // only modify range if it intersects with current range
          if (textRange.compareEndPoints('StartToStart', selection) == -1)
            if (textRange.compareEndPoints('StartToEnd', selection) > -1 &&
                textRange.compareEndPoints('EndToEnd', selection) == -1)
              selection.setEndPoint('StartToStart', textRange);
          else
            if (textRange.compareEndPoints('EndToStart', selection) < 1 &&
                textRange.compareEndPoints('EndToEnd', selection) > -1)
              selection.setEndPoint('EndToEnd', textRange);
          selection.select();
        }
      },
      removeAllRanges: function() {
        this._document.selection.empty();
      },
      getRangeAt: function(index) {
        var textRange = this._document.selection.createRange();
        if (this._selectionExists(textRange))
          return TextRangeUtils.convertToDOMRange(textRange, this._document);
        return null;
      },
      toString: function() {
        return this._document.selection.createRange().text;
      }
    };

    var selection = new Selection(document);
    return function() { return selection; };
  })();
}

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
