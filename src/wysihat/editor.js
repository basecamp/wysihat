/**
 * class WysiHat.Editor
 *  includes WysiHat.Commands
 **/
WysiHat.Editor = Class.create({
  /**
   *  new WysiHat.Editor(textarea)
   *  - textarea (String | Element): an id or DOM node of the textarea that
   *  you want to convert to rich text.
   *
   *  Creates a new editor controller and model for the textarea.
   **/
  initialize: function(textarea) {
    var editor = this;

    this.textarea = $(textarea);
    this.textarea.hide();

    this.model = new WysiHat.iFrame(this.textarea, function(model) {
      editor.document = model._document;
      editor.window = model._window;
      editor.selection = model.getSelection();

      Event.observe(editor.window, 'focus', function(event) { editor.focus(); });
      Event.observe(editor.window, 'blur', function(event) { editor.blur(); });

      Event.observe(editor.document, 'keydown', function(event) {
        if (event.keyCode == 86)
          editor.model.fire("wysihat:paste", { editor: editor });
      });
      Event.observe(editor.window, 'paste', function(event) {
        editor.model.fire("wysihat:paste", { editor: editor });
      });

      editor.focus();
      editor.window.focus();
    }).element;

    this.model.observe("wysihat:changed", function(event) {
      event.target.save();
    });
  },

  /**
   * WysiHat.Editor#focus() -> undefined
   *  binds observers to mouseup, mousemove, keypress, and keyup on focus
   **/
  focus: function() {
    if (this.hasFocus)
      return;

    this.hasFocus = true;

    var editor = this;
    this.focusObserver = function() {
      editor.model.fire("wysihat:changed", { editor: editor });
    };

    ['mouseup', 'mousemove', 'keypress', 'keyup'].each(function(event) {
      Event.observe(editor.document, event, editor.focusObserver);
    });
  },

  /**
   * WysiHat.Editor#blur() -> undefined
   *  removes observers to mouseup, mousemove, keypress, and keyup on blur
   **/
  blur: function() {
    this.hasFocus = false;

    var editor = this;
    // remove the event listeners we don't need anymore
    ['mouseup', 'mousemove', 'keypress', 'keyup'].each(function(event) {
      Event.stopObserving(editor.document, event, editor.focusObserver);
    });
  }
});
