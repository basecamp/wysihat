new Test.Unit.Runner({
  testAttachAndCreateIframe: function() {
    var runner = this;

    var editor = WysiHat.Editor.attach('content');
    editor.whenReady(function () {
      runner.assertNotVisible($('content'));
      runner.assert($('content_editor'));
      runner.assert($('content_editor').ready);
      runner.assert($('content_editor').getDocument());
      runner.assert($('content_editor').getWindow());
      runner.assertEqual('on', $('content_editor').getDocument().designMode);
    });

    runner.wait(1000, function () {});
  },

  testIncludedModules: function () { with(this) {
    var module = { xyz123: function () {} }
    var editor1 = WysiHat.Editor.attach('content');

    WysiHat.Editor.include(module);
    var editor2 = WysiHat.Editor.attach('content');

    // The extension should not be retrospective.
    assert(!Object.isFunction(editor1.xyz123));

    // The extension should work on subsequent editors though.
    assert(Object.isFunction(editor2.xyz123));
  }}
});
