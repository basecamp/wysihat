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
      runner.assertEqual("<span>bold</span>", $$('div.editor_toolbar a.bold').first().innerHTML.toLowerCase());
      runner.assert($$('div.editor_toolbar a.underline').first());
      runner.assertEqual("<span>underline</span>", $$('div.editor_toolbar a.underline').first().innerHTML.toLowerCase());
      runner.assert($$('div.editor_toolbar a.italic').first());
      runner.assertEqual("<span>italic</span>", $$('div.editor_toolbar a.italic').first().innerHTML.toLowerCase());
    });

    runner.wait(1000, function() {});
  }
});
