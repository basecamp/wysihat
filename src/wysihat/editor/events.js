/** section: wysihat
 *
 *  To observe any double clicks in the editor:
 *
 *  var editor = WysiHat.Editor.attach(textarea);
 *  editor.observe('wysihat:dblclick', handler);
 *
 *  The most useful event is the 'wysihat:change' event. It is fired anytime
 *  the text contents of the editor changes. This does not include any mouse
 *  or cursor movements.
 *
 *  In addition to the standard DOM events, 'wysihat:cursormove' is fired
 *  anytime the cursor is moved from any mouse clicks or moved by a key
 *  press. Is also fired when something is typed because the cursor is
 *  still advancing.
**/
document.observe("dom:loaded", function() {
  $(document.body).observe("keydown", function(event) {
    var editor = event.findElement("div.editor");
    if (editor && event.keyCode == 86) editor.fire("wysihat:paste");
  });

  $(document.body).observe("paste", function(event) {
    var editor = event.findElement("div.editor");
    if (editor) editor.fire("wysihat:paste");
  });


  var observeCursorMovementsHandler = function(editor) {
    var range = editor.selection.getRange();
    if (editor.selection.previousRange != range) {
      editor.fire("wysihat:cursormove");
      editor.selection.previousRange = range;
    }
  }

  $(document.body).observe("keyup", function(event) {
    var editor = event.findElement("div.editor");
    if (editor) {
      observeCursorMovementsHandler(editor);

      var contents = editor.rawContent();
      if (editor.previousContents != contents) {
        editor.fire("wysihat:change");
        editor.previousContents = contents;
      }
    }
  });

  $(document.body).observe("mouseup", function(event) {
    var editor = event.findElement("div.editor");
    if (editor) {
      observeCursorMovementsHandler(editor);

      var range = editor.selection.getRange();
      // FIXME: firing an event here breaks double clicking to select word in IE
      // if (!range.collapsed)
      //   editor.fire("wysihat:select");
    }
  });


  var focusInHandler = function(event) {
    var editor = event.findElement("div.editor");
    if (editor) editor.fire("wysihat:focus")
  };

  var focusOutHandler = function(event) {
    var editor = event.findElement("div.editor");
    if (editor) editor.fire("wysihat:blur")
  };

  if (document.addEventListener) {
    document.addEventListener("focus", focusInHandler, true);
    document.addEventListener("blur", focusOutHandler, true);
  } else {
    document.observe("focusin", focusInHandler);
    document.observe("focusout", focusOutHandler);
  }
});
