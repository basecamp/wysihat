function sanitize(html, options) {
  return new Element("div").update(html).sanitizeContents(options).innerHTML.toLowerCase();
}

new Test.Unit.Runner({
  testSanitize: function() {
    var runner = this;

    runner.assertEqual(
      "hello",
      sanitize("hello", {})
    );

    runner.assertEqual(
      "hello",
      sanitize("<strong>hello</strong>", {})
    );

    runner.assertEqual(
      "hello",
      sanitize("<em><strong>hello</strong></em>", {})
    );

    runner.assertEqual(
      "<strong>hello</strong>",
      sanitize("<strong>hello</strong>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong>hello</strong>",
      sanitize("<em><strong>hello</strong></em>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong>hello</strong>",
      sanitize("<strong><em>hello</em></strong>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong>hello</strong> world!",
      sanitize("<p><strong><em>hello</em></strong> world!</p>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong><em>hello</em></strong>",
      sanitize("<strong><em>hello</em></strong>", {allow: "em, strong"})
    );

    runner.assertEqual(
      "<a>google</a>",
      sanitize("<a href='http://www.google.com/' title=\"google\">google</a>", {allow: "a"})
    );

    runner.assertEqual(
      "<a href=\"http://www.google.com/\">google</a>",
      sanitize("<a href=\"http://www.google.com/\" title=\"google\">google</a>", {allow: "a[href]"})
    );

    if (Prototype.Browser.IE) {
      runner.assertEqual(
        "hello<span id=bookmark> </span>",
        sanitize("hello<span id=bookmark> </span>", {allow: "span[id]"})
      );
    } else {
      runner.assertEqual(
        "hello<span id=\"bookmark\"> </span>",
        sanitize("hello<span id=\"bookmark\"> </span>", {allow: "span[id]"})
      );
    }

    runner.assertEqual(
      "<img src=\"http://www.google.com/intl/en_all/images/logo.gif\">",
      sanitize("<img src=\"http://www.google.com/intl/en_all/images/logo.gif\">", {allow: "img[src], a[href]"})
    );
  }
});
