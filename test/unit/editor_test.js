new Test.Unit.Runner({
  testAttachAndCreateIframe: function() {
    var runner = this;

    WysiHat.Editor.attach('content');

    runner.assertNotVisible($('content'));
    runner.assert($('content_editor'));
    runner.assert($('content_editor').ready);
    runner.assert($('content_editor').getDocument());
    runner.assert($('content_editor').getWindow());
    runner.assertEqual('on', $('content_editor').getDocument().designMode);
  }
});
