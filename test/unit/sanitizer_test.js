new Test.Unit.Runner({
  testSanitize: function() {
    var runner = this;

    runner.assertEqual(
      "Hello",
      "Hello".sanitize()
    );

    runner.assertEqual(
      "Hello",
      "<strong>Hello</strong>".sanitize()
    );

    runner.assertEqual(
      "Hello",
      "<em><strong>Hello</strong></em>".sanitize()
    );

    runner.assertEqual(
      "<strong>Hello</strong>",
      "<strong>Hello</strong>".sanitize({tags: ["strong"]})
    );

    runner.assertEqual(
      "<strong>Hello</strong>",
      "<em><strong>Hello</strong></em>".sanitize({tags: ["strong"]})
    );

    runner.assertEqual(
      "<strong>Hello</strong>",
      "<strong><em>Hello</em></strong>".sanitize({tags: ["strong"]})
    );

    runner.assertEqual(
      "<strong>Hello</strong> World!",
      "<p><strong><em>Hello</em></strong> World!</p>".sanitize({tags: ["strong"]})
    );

    runner.assertEqual(
      "<strong><em>Hello</em></strong>",
      "<strong><em>Hello</em></strong>".sanitize({tags: ["em", "strong"]})
    );

    runner.assertEqual(
      "<a>Google</a>",
      "<a href='http://www.google.com/' title=\"Google\">Google</a>".sanitize({tags: ["a"]})
    );

    runner.assertEqual(
      "<a href=\"http://www.google.com/\">Google</a>",
      "<a href=\"http://www.google.com/\" title=\"Google\">Google</a>".sanitize({tags: ["a"], attributes: ["href"]})
    );

    if (Prototype.Browser.IE) {
      runner.assertEqual(
        "Hello<span id=bookmark> </span>",
        "Hello<span id=bookmark> </span>".sanitize({tags: ["span"], attributes: ["id"]})
      );
    } else {
      runner.assertEqual(
        "Hello<span id=\"bookmark\"> </span>",
        "Hello<span id=\"bookmark\"> </span>".sanitize({tags: ["span"], attributes: ["id"]})
      );
    }

    runner.assertEqual(
      "<img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\">",
      "<img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\">".sanitize({tags: ['img'], attributes: ["href", "src"]})
    );
  }
});
