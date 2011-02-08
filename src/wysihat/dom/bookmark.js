//= require "./selection"

if (Prototype.Browser.IE) {
  Object.extend(Selection.prototype, (function() {
    function setBookmark() {
      var bookmark = $('bookmark');
      if (bookmark) bookmark.remove();

      bookmark = new Element('span', { 'id': 'bookmark' }).update("&nbsp;");
      var parent = new Element('div');
      parent.appendChild(bookmark);

      var range = this._document.selection.createRange();
      range.collapse();
      range.pasteHTML(parent.innerHTML);
    }

    function moveToBookmark() {
      var bookmark = $('bookmark');
      if (!bookmark) return;

      var range = this._document.selection.createRange();
      range.moveToElementText(bookmark);
      range.collapse();
      range.select();

      bookmark.remove();
    }

    return {
      setBookmark:    setBookmark,
      moveToBookmark: moveToBookmark
    }
  })());
} else {
  Object.extend(Selection.prototype, (function() {
    function setBookmark() {
      var bookmark = $('bookmark');
      if (bookmark) bookmark.remove();

      bookmark = new Element('span', { 'id': 'bookmark' }).update("&nbsp;");
      this.getRangeAt(0).insertNode(bookmark);
    }

    function moveToBookmark() {
      var bookmark = $('bookmark');
      if (!bookmark) return;

      var range = document.createRange();
      range.setStartBefore(bookmark);
      this.removeAllRanges();
      this.addRange(range);

      bookmark.remove();
    }

    return {
      setBookmark:    setBookmark,
      moveToBookmark: moveToBookmark
    }
  })());
}
