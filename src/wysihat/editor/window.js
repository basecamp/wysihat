/** section: wysihat
 *  mixin WysiHat.Window
 *
 *  Methods will be mixed into the editor element. These methods handle window
 *  events such as focus and blur events on the editor.
**/
WysiHat.Window = (function() {
  /**
   *  WysiHat.Window#getDocument() -> Document
   *
   *  Cross browser method to return the iFrame's document.
   *  You should not need to access this directly, and this API is not final.
  **/
  function getDocument() {
    return this.contentDocument || this.contentWindow.document;
  }

  /**
   *  WysiHat.Window#getWindow() -> Window
   *
   *  Cross browser method to return the iFrame's window.
   *  You should not need to access this directly, and this API is not final.
  **/
  function getWindow() {
    if (this.contentDocument && this.contentDocument.defaultView)
      return this.contentDocument.defaultView;
    else if (this.contentWindow.document)
      return this.contentWindow;
    else
      return null;
  }

  /**
   *  WysiHat.Window#focus() -> undefined
   *
   *  binds observers to mouseup, mousemove, keypress, and keyup on focus
  **/
  function focus() {
    this.getWindow().focus();

    if (this.hasFocus)
      return;

    this.hasFocus = true;
  }

  /**
   *  WysiHat.Window#blur() -> undefined
   *
   *  removes observers to mouseup, mousemove, keypress, and keyup on blur
  **/
  function blur() {
    this.hasFocus = false;
  }

  return {
    getDocument: getDocument,
    getWindow: getWindow,
    focus: focus,
    blur: blur
  };
})();

WysiHat.Editor.include(WysiHat.Window);
