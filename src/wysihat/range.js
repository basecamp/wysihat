/**
 * class Range
 *
 *  *Under construction*
 *
 *  An attempt to implement the W3C Range in IE.
 *
 **/
if (Prototype.Browser.IE) {
  function Range(ownerDocument) {
    this.ownerDocument = ownerDocument;

    this.startContainer = this.ownerDocument.documentElement;
    this.startOffset    = 0;
    this.endContainer   = this.ownerDocument.documentElement;
    this.endOffset      = 0;

    this.collapsed = true;
    this.commonAncestorContainer = null;

    this.START_TO_START = 0;
    this.START_TO_END   = 1;
    this.END_TO_END     = 2;
    this.END_TO_START   = 3;
  }

  document.createRange = function() {
    return new Range(this);
  }

  Object.extend(Range.prototype, {
    setStart: function(parent, offset) {},
    setEnd: function(parent, offset) {},
    setStartBefore: function(node) {},
    setStartAfter: function(node) {},
    setEndBefore: function(node) {},
    setEndAfter: function(node) {},

    collapse: function(toStart) {},

    selectNode: function(n) {},
    selectNodeContents: function(n) {},

    compareBoundaryPoints: function(how, sourceRange) {},

    deleteContents: function() {},
    extractContents: function() {},
    cloneContents: function() {},

    insertNode: function(n) {
      var range = this.ownerDocument.selection.createRange();
      var parent = this.ownerDocument.createElement('div');
      parent.appendChild(n);
      range.collapse();
      range.pasteHTML(parent.innerHTML);
    },
    surroundContents: function(newParent) {
      var range = this.ownerDocument.selection.createRange();
      var parent = this.document.createElement('div');
      parent.appendChild(newParent);
      node.innerHTML += range.htmlText;
      range.pasteHTML(parent.innerHTML);
    },

    cloneRange: function() {},
    toString: function() {},
    detach: function() {}
  });
}
