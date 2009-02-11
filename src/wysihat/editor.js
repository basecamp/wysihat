/** section: wysihat
 * WysiHat.Editor
 **/
WysiHat.Editor = {
  /** section: wysihat
   * WysiHat.Editor.attach(textarea) -> undefined
   * - textarea (String | Element): an id or DOM node of the textarea that
   *   you want to convert to rich text.
   *
   *  Creates a new editor for the textarea.
   **/
  attach: function(textarea, options) {
    options = $H(options);
    textarea = $(textarea);
    textarea.hide();

    var model = options.get('model') || WysiHat.iFrame;

    return model.create(textarea, function(editArea) {
      var document = editArea.getDocument();
      var window = editArea.getWindow();

      editArea.load();

      Event.observe(window, 'focus', function(event) { editArea.focus(); });
      Event.observe(window, 'blur', function(event) { editArea.blur(); });


      Event.observe(document, 'mouseup', function(event) {
        editArea.fire("wysihat:mouseup");
      });

      Event.observe(document, 'mousemove', function(event) {
        editArea.fire("wysihat:mousemove");
      });

      Event.observe(document, 'keypress', function(event) {
        editArea.fire("wysihat:change");
        editArea.fire("wysihat:keypress");
      });

      Event.observe(document, 'keyup', function(event) {
        editArea.fire("wysihat:change");
        editArea.fire("wysihat:keyup");
      });

      Event.observe(document, 'keydown', function(event) {
        if (event.keyCode == 86)
          editArea.fire("wysihat:paste");
      });

      Event.observe(window, 'paste', function(event) {
        editArea.fire("wysihat:paste");
      });


      editArea.observe("wysihat:change", function(event) {
        event.target.save();
      });


      // Fire the cursormove event if selection has changed due to some event
      fun = function (event) {
        var rg = editArea.selection.getRange();
        if (editArea.lastRange != rg) {
          editArea.fire("wysihat:cursormove");
          editArea.lastRange = rg;
        }
      }
      editArea.observe("wysihat:change", fun);
      editArea.observe("wysihat:mouseup", fun);
      editArea.observe("wysihat:mousemove", fun);

      // Firefox starts "locked"
      // Insert a character bogus character and undo
      if (Prototype.Browser.Gecko) {
        editor.execCommand('inserthtml', false, '-');
        editor.execCommand('undo', false, null);
      }

      editArea.focus();
    });
  }
};
