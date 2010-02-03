new Test.Unit.Runner({
  setup: function() {
    this.textarea = $('content');
    this.editor = WysiHat.Editor.attach(this.textarea);
  },

  testInsertHTML: function() {
    var runner = this;

    this.editor.focus();
    this.editor.insertHTML("Hello.");
    runner.assertEqual("<p>Hello.</p>", this.editor.content());
  }
});
