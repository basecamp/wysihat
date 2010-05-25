function sanitize(html, options) {
  return Element("div").update(html).sanitizeContents(options).innerHTML;
}

new Test.Unit.Runner({
  testSanitize: function() {
    var runner = this;

    runner.assertEqual(
      "Hello",
      sanitize("Hello", {})
    );

    runner.assertEqual(
      "Hello",
      sanitize("<strong>Hello</strong>", {})
    );

    runner.assertEqual(
      "Hello",
      sanitize("<em><strong>Hello</strong></em>", {})
    );

    runner.assertEqual(
      "<strong>Hello</strong>",
      sanitize("<strong>Hello</strong>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong>Hello</strong>",
      sanitize("<em><strong>Hello</strong></em>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong>Hello</strong>",
      sanitize("<strong><em>Hello</em></strong>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong>Hello</strong> World!",
      sanitize("<p><strong><em>Hello</em></strong> World!</p>", {allow: "strong"})
    );

    runner.assertEqual(
      "<strong><em>Hello</em></strong>",
      sanitize("<strong><em>Hello</em></strong>", {allow: "em, strong"})
    );

    runner.assertEqual(
      "<a>Google</a>",
      sanitize("<a href='http://www.google.com/' title=\"Google\">Google</a>", {allow: "a"})
    );

    runner.assertEqual(
      "<a href=\"http://www.google.com/\">Google</a>",
      sanitize("<a href=\"http://www.google.com/\" title=\"Google\">Google</a>", {allow: "a[href]"})
    );

    if (Prototype.Browser.IE) {
      runner.assertEqual(
        "Hello<span id=bookmark> </span>",
        sanitize("Hello<span id=bookmark> </span>", {allow: "span[id]"})
      );
    } else {
      runner.assertEqual(
        "Hello<span id=\"bookmark\"> </span>",
        sanitize("Hello<span id=\"bookmark\"> </span>", {allow: "span[id]"})
      );
    }

    runner.assertEqual(
      "<img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\">",
      sanitize("<img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\">", {allow: "img[src], a[href]"})
    );
  }
});
