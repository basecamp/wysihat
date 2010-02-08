WysiHat.Observer = Class.create({
  initialize: function(region) {
    this.region = $(region);
    this.registerObservers();
    this.start();
  },

  registerObservers: function() {
    this.region.observe("keydown", this.onRegionKeyDown.bind(this));
    this.region.observe("keyup", this.onRegionKeyUp.bind(this));
    this.region.observe("paste", this.onRegionPaste.bind(this));
    this.region.observe("mouseup", this.onRegionMouseUp.bind(this));
  },

  start: function() {
    this.started = true;
  },

  stop: function() {
    this.started = false;
  },

  onRegionKeyDown: function(event) {
    if (!this.started) return;
    var element = event.findElement("div.editor");
    if (element && event.keyCode == 86) element.fire("wysihat:paste");
  },

  onRegionKeyUp: function(event) {
    if (!this.started) return;

    var element = event.findElement("div.editor");
    if (element) {
      this.observeCursorMovements(element);
      this.observeChanges(element);
    }
  },

  onRegionPaste: function(event) {
    if (!this.started) return;
    var element = event.findElement("div.editor");
    if (element) element.fire("wysihat:paste");
  },

  onRegionMouseUp: function(event) {
    if (!this.started) return;

    var element = event.findElement("div.editor");
    if (element) {
      this.observeCursorMovements(element);
      this.observeSelections(element);
    }
  },

  observeChanges: function(editor) {
    var contents = editor.rawContent();
    if (editor.previousContents != contents) {
      editor.fire("wysihat:change");
      editor.previousContents = contents;
    }
  },

  observeCursorMovements: function(editor) {
    var range = editor.selection.getRange();
    if (editor.selection.previousRange != range) {
      editor.fire("wysihat:cursormove");
      editor.selection.previousRange = range;
    }
  },

  observeSelections: function(editor) {
    var range = editor.selection.getRange();
    // FIXME: firing an event here breaks double clicking to select word in IE
    // if (!range.collapsed)
    //   editor.fire("wysihat:select");
  }
});
