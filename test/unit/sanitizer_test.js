test("sanitize", function() {
  this.assertEqual(
    "Hello",
    "Hello".sanitize()
  );

  this.assertEqual(
    "Hello",
    "<strong>Hello</strong>".sanitize()
  );

  this.assertEqual(
    "Hello",
    "<em><strong>Hello</strong></em>".sanitize()
  );

  this.assertEqual(
    "<strong>Hello</strong>",
    "<strong>Hello</strong>".sanitize({tags: ["strong"]})
  );

  this.assertEqual(
    "<strong>Hello</strong>",
    "<em><strong>Hello</strong></em>".sanitize({tags: ["strong"]})
  );

  this.assertEqual(
    "<strong>Hello</strong>",
    "<strong><em>Hello</em></strong>".sanitize({tags: ["strong"]})
  );

  this.assertEqual(
    "<strong>Hello</strong> World!",
    "<p><strong><em>Hello</em></strong> World!</p>".sanitize({tags: ["strong"]})
  );

  this.assertEqual(
    "<strong><em>Hello</em></strong>",
    "<strong><em>Hello</em></strong>".sanitize({tags: ["em", "strong"]})
  );

  this.assertEqual(
    "<a>Google</a>",
    "<a href='http://www.google.com/' title=\"Google\">Google</a>".sanitize({tags: ["a"]})
  );

  this.assertEqual(
    "<a href=\"http://www.google.com/\">Google</a>",
    "<a href=\"http://www.google.com/\" title=\"Google\">Google</a>".sanitize({tags: ["a"], attributes: ["href"]})
  );

  if (Prototype.Browser.IE) {
    this.assertEqual(
      "Hello<span id=bookmark> </span>",
      "Hello<span id=bookmark> </span>".sanitize({tags: ["span"], attributes: ["id"]})
    );
  } else {
    this.assertEqual(
      "Hello<span id=\"bookmark\"> </span>",
      "Hello<span id=\"bookmark\"> </span>".sanitize({tags: ["span"], attributes: ["id"]})
    );
  }

  this.assertEqual(
    "<img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\">",
    "<img src=\"http://www.google.com/intl/en_ALL/images/logo.gif\">".sanitize({tags: ['img'], attributes: ["href", "src"]})
  );
});
