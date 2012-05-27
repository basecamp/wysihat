new Test.Unit.Runner({
  setup: function() {
    this.textarea = $('content');
    this.editor = WysiHat.Editor.attach(this.textarea);
    this.editor.focus();
  },

  teardown: function() {
    this.editor.innerHTML = "";
    this.textarea.value = "";
  },

  testInsertHTML: function() {
    var runner = this;

    this.editor.insertHTML("<p>Hello.</p>");
    runner.assertEqual("<p>Hello.</p>", this.editor.innerHTML);
  },

  testBoldSelection: function() {
    var runner = this;

    // this.editor.insertHTML("<p>Hello.</p>");
    this.editor.innerHTML = '<p id="hello">Hello.</p>'.formatHTMLInput();

    window.getSelection().selectNode(this.editor.down('#hello'));
    this.editor.boldSelection();

    runner.assert(this.editor.boldSelected());
    runner.assertEqual('<p id="hello"><strong>Hello.</strong></p>', this.editor.innerHTML);
  }
});
