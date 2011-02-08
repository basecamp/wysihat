//= require "./ierange"
//= require "./range"

if (Prototype.Browser.IE) {
  Object.extend(Selection.prototype, (function() {
    // TODO: More robust getNode
    function getNode() {
      var range = this._document.selection.createRange();
      return $(range.parentElement());
    }

    // TODO: IE selectNode should work with range.selectNode
    function selectNode(element) {
      var range = this._document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
    }

    return {
      getNode:    getNode,
      selectNode: selectNode
    }
  })());
} else {
  // WebKit does not have a public Selection prototype
  if (typeof Selection == 'undefined') {
    var Selection = {}
    Selection.prototype = window.getSelection().__proto__;
  }

  Object.extend(Selection.prototype, (function() {
    function getNode() {
      if (this.rangeCount > 0)
        return this.getRangeAt(0).getNode();
      else
        return null;
    }

    function selectNode(element) {
      var range = document.createRange();
      range.selectNode(element);
      this.removeAllRanges();
      this.addRange(range);
    }

    return {
      getNode:    getNode,
      selectNode: selectNode
    }
  })());
}
