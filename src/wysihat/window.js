/**
 * mixin WysiHat.Window
 *
 *  Methods will be mixed into the editor element. These methods handle window
 *  events such as focus and blur events on the editor.
 */
WysiHat.Window = {
  /**
   * WysiHat.Window#getDocument() -> Document
   *  Cross browser method to return the iFrame's document.
   *  You should not need to access this directly, and this API is not final.
   */
  getDocument: function() {
    return this.contentDocument || this.contentWindow.document;
  },

  /**
   * WysiHat.Window#getWindow() -> Window
   *  Cross browser method to return the iFrame's window.
   *  You should not need to access this directly, and this API is not final.
   */
  getWindow: function() {
    if (this.contentDocument)
      return this.contentDocument.defaultView;
    else if (this.contentWindow.document)
      return this.contentWindow;
  },

  /**
   * WysiHat.Window#focus() -> undefined
   *  binds observers to mouseup, mousemove, keypress, and keyup on focus
   **/
  focus: function() {
    this.getWindow().focus();

    if (this.hasFocus)
      return;

    this.hasFocus = true;

    var editor = this;
    this.focusObserver = function() {
      editor.fire("wysihat:change");
    };

    ['mouseup', 'mousemove', 'keypress', 'keyup'].each(function(event) {
      Event.observe(editor.getDocument(), event, editor.focusObserver);
    });
  },

  /**
   * WysiHat.Window#blur() -> undefined
   *  removes observers to mouseup, mousemove, keypress, and keyup on blur
   **/
  blur: function() {
    this.hasFocus = false;

    var editor = this;
    // remove the event listeners we don't need anymore
    ['mouseup', 'mousemove', 'keypress', 'keyup'].each(function(event) {
      Event.stopObserving(editor.getDocument(), event, editor.focusObserver);
    });
  }
}
