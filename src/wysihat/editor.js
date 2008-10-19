WysiHat.Editor = {
  /**
   *  WysiHat.Editor.attach(textarea)
   *  - textarea (String | Element): an id or DOM node of the textarea that
   *  you want to convert to rich text.
   *
   *  Creates a new editor for the textarea.
   **/
  attach: function(textarea) {
    var textarea = $(textarea);
    textarea.hide();

    return WysiHat.iFrame.create(textarea, function(editArea) {
      var document = editArea.getDocument();
      var window = editArea.getWindow();

      editArea.load();

      Event.observe(window, 'focus', function(event) { editArea.focus(); });
      Event.observe(window, 'blur', function(event) { editArea.blur(); });

      ['mouseup', 'mousemove', 'keypress', 'keyup'].each(function(event) {
        Event.observe(document, event, function() {
          editArea.fire("wysihat:change");
        });
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

      editArea.focus();
    });
  }
}
