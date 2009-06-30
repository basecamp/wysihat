
new Test.Unit.Runner({
  testAttachAndCreateIframe: function() {
    var runner = this;

    var editor = WysiHat.Editor.attach('content');
    editor.whenReady(function() {
      this.editor = editor;
      runner.assertNotVisible($('content'));
      runner.assert($('content_editor'));
      runner.assert($('content_editor').ready);
      runner.assert($('content_editor').getDocument());
      runner.assert($('content_editor').getWindow());
      runner.assertEqual('on', $('content_editor').getDocument().designMode);
  });

    runner.wait(1000, function() {});
  },

  testIncludedModules: function() { with(this) {
    var module = { xyz123: function() {} };
    var editor1 = WysiHat.Editor.attach('content');

    WysiHat.Editor.include(module);
    var editor2 = WysiHat.Editor.attach('content');

    // The extension should not be retrospective.
    assert(!Object.isFunction(editor1.xyz123));

    // The extension should work on subsequent editors though.
    assert(Object.isFunction(editor2.xyz123));
    editor1.unattach();
    editor2.unattach();
  }},

  testBold: function() { with(this) {
    testFontFormat('bold');
    testNestedFontFormat('bold', 'b');
  }},

  testItalic: function() { with(this) {
    testFontFormat('italic');
    testNestedFontFormat('italic', 'i');
  }},
  
  testUnderline: function() { with(this) {
    testFontFormat('underline');
    testNestedFontFormat('underline', 'u');
  }},

  testFonts: function() { with(this) {
    editor.setContent("Times");
    selectFirstNode();
    editor.fontSelection('times');
    assertEqual('times', editor.fontSelected());
  }},

  testNestedFonts: function() { with(this) {
    editor.setContent("<font face='times'>Times</font>");
    selectFirstNode();
    assertEqual('times', editor.fontSelected());
  }},

  testFontSizes: function() { with(this) {
    editor.setContent("<font size='7'>Font Size</font>");
    selectFirstNode();
    editor.fontSizeSelection(5);
    assertEqual(5, editor.fontSizeSelected());
  }},

  testNestedFontSizes: function() { with(this) {
    editor.setContent("<font size='7'>Font Size</font>");
    selectFirstNode();
    assertEqual(7, editor.fontSizeSelected());
  }},

  testColor: function() { with (this) {
    editor.setContent('color');
    selectFirstNode();
    editor.colorSelection("#555555");
    assertEqual('#555555', editor.colorSelected());
  }},

  testNestedColor: function() { with(this) {
    editor.setContent("<font color='#555555'>color</font>");
    selectFirstNode();
    assertEqual('#555555', editor.colorSelected());
  }},
  
  testBackgroundColor: function() { with(this) {
    editor.setContent("background color");
    selectFirstNode();
    editor.backgroundColorSelection("#555555");
    assertEqual('#555555', editor.backgroundColorSelected());
  }},

  testNestedBackgroundColor: function() { with(this) {
    editor.setContent("<font style='background-color:#555555'>background-color</font>");
    selectFirstNode();
    assertEqual('#555555', editor.backgroundColorSelected());
  }},

  testAlignment: function() { with(this) {
    editor.setContent("align me");
    selectFirstNode();
    editor.alignSelection('right');
    assertEqual('right', editor.alignSelected());
  }},

  testNestedAlignment: function() { with(this) {
    editor.setContent("<div style='text-align:right'>align me</div>");
    selectFirstNode();
    assertEqual('right', editor.alignSelected());
  }},

  testStyle: function(){ with(this) {
    editor.setContent("set my style");
    selectFirstNode();
    editor.setStyle( {fontFamily: "arial", fontSize: "13px"} );
    assert(editor.getStyle('fontFamily'));
    assertEqual('arial', editor.getStyle('fontFamily'));
    assertEqual('13px', editor.getStyle('fontSize'));
  }},

  testLink: function() { with (this) {
    link = 'http://github.com/';
    editor.setContent('linky link');
    selectFirstNode();

    wait(500, function() {
      var textarea = $('link').down('textarea');
      textarea.focus(); // simulate real world case of IE losing focus
      textarea.value = link;
      editor.linkSelection(link);
      assert(editor.linkSelected());
      assertEqual(link, editor.selection.getNode().href);
    });
  }},
  
  testNestedLink: function(){ with (this) {
    link = 'http://github.com/';
    editor.setContent('<a href="' + link + '">linky link</a>');
    selectFirstNode();
    assert(editor.linkSelected());
    assertEqual(link, editor.selection.getNode().href);
  }},

  testUnattach: function() { with(this) {
    editor.setContent("<font face='times'>Unattached</font>");
    editor.unattach();
    var iframe = $('content_editor');
    assert(!iframe);
  }},

  setup: function() {
    this.selectFirstNode = function() {
      var iframe = $('content_editor');
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      var node = doc.body.childNodes[0];
      editor.selection.selectNode(node);
    };

    this.testFontFormat = function(styleType) {
      editor.setContent('Boldly going where no man has gone before');
      this.selectFirstNode();
      editor[styleType + 'Selection']();
      this.assert(editor[styleType + 'Selected']());
    };

    this.testNestedFontFormat = function(styleType, styleTag) {
      editor.setContent('<' + styleTag + '>Boldly going where no man has gone before</' + styleTag + '>');
      this.selectFirstNode();
      this.assert(editor[styleType + 'Selected']());
    };
  }
});