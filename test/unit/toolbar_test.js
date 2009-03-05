new Test.Unit.Runner({
  testToolbarWithBasicButtonSet: function() {
    var runner = this;

    var editor = WysiHat.Editor.attach('content');
    var toolbar = new WysiHat.Toolbar(editor);
    toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);

    editor.whenReady(function() {
      runner.assertEqual(editor, toolbar.editor);
      runner.assertEqual(toolbar.element, $$('div.editor_toolbar').first());

      runner.assert($$('div.editor_toolbar').first());
      runner.assert($$('div.editor_toolbar a.bold').first());
      runner.assertEqual("Bold", $$('div.editor_toolbar a.bold').first().text);
      runner.assert($$('div.editor_toolbar a.underline').first());
      runner.assertEqual("Underline", $$('div.editor_toolbar a.underline').first().text);
      runner.assert($$('div.editor_toolbar a.italic').first());
      runner.assertEqual("Italic", $$('div.editor_toolbar a.italic').first().text);
    });

    runner.wait(1000, function() {});
  }
});
