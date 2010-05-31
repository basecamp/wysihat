new Test.Unit.Runner({
  testDetectParagraphType: function() {
    var runner = this;

    if (Prototype.Browser.WebKit)
      runner.assertEqual("div", WysiHat.BrowserFeatures.paragraphType);
    else if (Prototype.Browser.Gecko)
      runner.assertEqual("br", WysiHat.BrowserFeatures.paragraphType);
    else if (Prototype.Browser.IE)
      runner.assertEqual("p", WysiHat.BrowserFeatures.paragraphType);
  },

  testDetectIndentType: function() {
    var runner = this;

    if (Prototype.Browser.WebKit || Prototype.Browser.IE)
      runner.assertEqual(true, WysiHat.BrowserFeatures.indentInsertsBlockquote);
    else if (Prototype.Browser.Gecko)
      runner.assertEqual(false, WysiHat.BrowserFeatures.indentInsertsBlockquote);
  }
});
