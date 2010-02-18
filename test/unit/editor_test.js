function setup() {
  this.textarea = $('content');
  this.editor = WysiHat.Editor.attach(this.textarea);
  this.editor.focus();
}

function teardown() {
  this.editor.innerHTML = "";
  this.textarea.value = "";
}

test("inertHTML", function() {
  setup.bind(this)();

  this.editor.insertHTML("<p>Hello.</p>");
  this.assertEqual("<p>Hello.</p>", this.editor.innerHTML.formatHTMLOutput());

  teardown.bind(this)();
});

test("boldSelection", function() {
  setup.bind(this)();

  // this.editor.insertHTML("<p>Hello.</p>");
  this.editor.innerHTML = '<p id="hello">Hello.</p>'.formatHTMLInput();

  window.getSelection().selectNode(this.editor.down('#hello'));
  this.editor.boldSelection();

  this.assert(this.editor.boldSelected());
  this.assertEqual('<p id="hello"><strong>Hello.</strong></p>', this.editor.innerHTML.formatHTMLOutput());

  teardown.bind(this)();
});
