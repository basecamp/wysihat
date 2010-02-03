new Test.Unit.Runner({
  setup: function() {
    this.textarea = $('content');
    this.editor = WysiHat.Editor.attach(this.textarea);
    this.editor.focus();
  },

  teardown: function() {
    this.editor.setContent("");
    this.textarea.value = "";
  },

  testInsertHTML: function() {
    var runner = this;

    this.editor.insertHTML("<p>Hello.</p>");
    runner.assertEqual("<p>Hello.</p>", this.editor.content());
  },

  testBoldSelection: function() {
    var runner = this;

    // this.editor.insertHTML("<p>Hello.</p>");
    this.editor.setContent("<p>Hello.</p>");

    this.editor.selection.selectNode(this.editor.down(0));
    this.editor.boldSelection();

    runner.assert(this.editor.boldSelected());
    runner.assertEqual("<p><strong>Hello.</strong></p>", this.editor.content());
  }
});
