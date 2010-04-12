new Test.Unit.Runner({
  testNormalizeTags: function() {
    var runner = this;

    [
      ['Hello', 'Hello'],
      ['Hello\nWorld\n', 'Hello\r\nWorld\r\n'],
      ['<p>Hello</p>\n<p>World</p>', '<p>Hello</p>\n<p>World</p>'],
      ['<p>Hello</p>\n<p>World</p>', '<P>Hello</P>\n<P>World</P>'],
      ['<p class="greeting">Hello</p>\n<p>World</p>', '<P class="greeting">Hello</P>\n<P>World</P>'],
      ['Hello<br />\nWorld', 'Hello<BR>\r\nWorld']
    ].each(function(assertion) {
      runner.assertEqual(assertion[0], assertion[1].tidyXHTML());
    });
  },

  testFormatHtml: function() {
    var runner = this;

    if (Prototype.Browser.WebKit) {
      [
        ['<p>Here is some basic text<br />\nwith a line break.</p>\n\n<p>And maybe another paragraph</p>',
          '<div>Here is some basic text</div><div>with a line break.</div><div><br></div><div>And maybe another paragraph</div>'],
        ['<p>Hello</p>\n\n<p>World!</p>', '<div>Hello</div><div><br></div><div>World!</div>'],
        ['<p>Hello</p>\n\n<p>World!</p>', '<div><p>Hello</p></div><div><br></div><div>World!</div>'],
        ['<p>Hello</p>\n\n<p>World!</p>', '<div>Hello<p></p></div><div><p></p></div><div><p></p></div><div><p>World!</p></div>'],
        ['<p>Hello<br />\nWorld!<br />\nGoodbye!</p>', 'Hello<div><div><div>World!<br></div><div>Goodbye!</div></div></div>'],
        ['<p>Hello<br />\nWorld!<br />\nGoodbye!</p>', 'Hello<div><div><div><div>World!</div><div>Goodbye!</div></div></div></div>'],
        ['<p>Hello</p>\n\n<p>World!<br />\nGoodbye!</p>', 'Hello<div><br><div><div><div>World!<br></div><div>Goodbye!</div></div></div></div>'],
        ['<p>Hello<br />\nWorld!</p>\n\n<p>Goodbye!</p>', 'Hello<div><div><div><div>World!<br></div><div><br></div><div>Goodbye!</div></div></div></div>'],

        ['<p>Some <strong>bold</strong> text</p>',
          'Some <span class="Apple-style-span" style="font-weight: bold;">bold</span> text'],
        ['<p>Some <em>italic</em> text</p>',
          'Some <span class="Apple-style-span" style="font-style: italic;">italic</span> text'],
        ['<p>Some <u>underlined</u> text</p>',
          'Some <span class="Apple-style-span" style="text-decoration: underline;">underlined</span> text'],
        ['<p>Some <strong><em>bold and italic</em></strong> text</p>',
          'Some <span class="Apple-style-span" style="font-weight: bold;"><span class="Apple-style-span" style="font-style: italic;">bold and italic</span></span> text'],
        ['<p>Some <em><strong>italic and bold</strong></em> text</p>',
           'Some <span class="Apple-style-span" style="font-style: italic;"><span class="Apple-style-span" style="font-weight: bold;">italic and bold</span></span> text'],
        ['<p>Some <strong><u><em>bold, underlined, and italic</em></u></strong> text</p>',
         'Some <span class="Apple-style-span" style="font-weight: bold;"><span class="Apple-style-span" style="text-decoration: underline;"><span class="Apple-style-span" style="font-style: italic;">bold, underlined, and italic</span></span></span> text'],
        ['<p>Hello<br />\n </p>', '<div>Hello</div><div> <span class="Apple-style-span" style="font-weight: bold;"></span></div>'],
        ['<p>Hello<span id="bookmark"> </span></p>', '<div>Hello<span id="bookmark"> </span></div>'],

        ['<p><img src="http://www.google.com/intl/en_ALL/images/logo.gif"></p>', '<img src="http://www.google.com/intl/en_ALL/images/logo.gif">'],

        ['<ol><li>one</li><li>two</li></ol>\n\n<p>not</p>', '<ol><li>one</li><li>two</li></ol><div>not</div>'],
        ['<ul><li>one</li><li>two</li></ul>\n\n<p>not</p>', '<ul><li>one</li><li>two</li></ul><div>not</div>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLOutput());
      });
    } else if (Prototype.Browser.Gecko) {
      [
        ['<p>Here is some basic text<br />\nwith a line break.</p>\n\n<p>And maybe another paragraph</p>',
          'Here is some basic text<br>with a line break.<br><br>And maybe another paragraph<br>'],
        ['<p>Here is some basic text<br />\nwith a line break.</p>\n\n<p>And maybe another paragraph</p>',
          'Here is some basic text<br>with a line break.<br><p></p><br>And maybe another paragraph<br>'],
        ['<p>Hello</p>\n\n<p>World!</p>', 'Hello<br><br>World!'],
        ['<p>Hello<br />\nWorld!<br />\nGoodbye!</p>', 'Hello<br>World!<br>Goodbye!<br>'],
        ['<p>Hello<br />\nWorld!</p>\n\n<p>Goodbye!</p>', 'Hello<br>World!<br><br>Goodbye!<br>'],

        ['<p>Some <strong>bold</strong> text</p>',
          'Some <span style="font-weight: bold;">bold</span> text'],
        ['<p>Some <em>italic</em> text</p>',
          'Some <span style="font-style: italic;">italic</span> text'],
        ['<p>Some <u>underlined</u> text</p>',
          'Some <span style="text-decoration: underline;">underlined</span> text'],
        ['<p>Some <em><strong>bold and italic</strong></em> text</p>',
          'Some <span style="font-weight: bold; font-style: italic;">bold and italic</span> text'],
         ['<p>Some <em><strong>italic and bold</strong></em> text</p>',
           'Some <span style="font-style: italic; font-weight: bold;">italic and bold</span> text'],
         ['<p>Some <u><em><strong>bold, underline, and italic</strong></em></u> text</p>',
            'Some <span style="font-weight: bold; text-decoration: underline; font-style: italic;">bold, underline, and italic</span> text'],

        ['<p><img src="http://www.google.com/intl/en_ALL/images/logo.gif"></p>', '<img src="http://www.google.com/intl/en_ALL/images/logo.gif">'],

        ['<ol><li>one</li><li>two</li></ol>\n\n<p>not</p>', '<ol><li>one</li><li>two</li></ol>not<br>'],
        ['<ul><li>one</li><li>two</li></ul>\n\n<p>not</p>', '<ul><li>one</li><li>two</li></ul>not<br>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLOutput());
      });
    } else if (Prototype.Browser.IE) {
      [
        ['', '<P></P>'],
        ['', '<P></P>\n<P></P>'],
        ['', '<P>\n<P>&nbsp;</P>\n<P></P>'],
        ['', '<P>&nbsp;</P>\n<P></P>'],
        ['<p>One<br />\nTwo</p>\n\n<p>Break</p>',
          '<P>\n<P>One</P><BR>\n<P>Two</P>\n<P></P>\n<P>\n<P>Break</P>\n<P></P>'],
        ['<p>Here is some basic text<br />\nwith a line break.</p>\n\n<p>And maybe another paragraph</p>',
          '<P>\n<P>Here is some basic text</P><BR>\n<P>with a line break.</P><BR>\n<P>&nbsp;</P><BR>\n<P>And maybe another paragraph</P>\n<P></P>'],
        ['<p>Hello</p>\n\n<p>World!</p>',
          '<P>\n<P>Hello</P><BR>\n<P>&nbsp;</P><BR>\n<P>World!</P>\n<P></P>'],
        ['<p>Hello<br />\nWorld!<br />\nGoodbye!</p>',
          '<P>\n<P>Hello</P><BR>\n<P>World!</P><BR>\n<P>Goodbye!</P>\n<P></P>'],
        ['<p>Hello<br />\nWorld!</p>\n\n<p>Goodbye!</p>',
          '<P>\n<P>Hello</P><BR>\n<P>World!</P><BR>\n<P>&nbsp;</P><BR>\n<P>Goodbye!</P>\n<P></P>'],

        ['<p>Some <strong>bold</strong> text</p>',
          'Some <STRONG>bold</STRONG> text'],
        ['<p>Some <em>italic</em> text</p>',
          'Some <EM>italic</EM> text'],
        ['<p>Some <u>underlined</u> text</p>',
          'Some <U>underlined</U> text'],

        ['<ol>\n<li>one</li>\n<li>two</li></ol>\n<p>not</p>', '<OL>\n<LI>one</LI>\n<LI>two</LI></OL>\n<P>not</P>'],
        ['<ul>\n<li>one</li>\n<li>two</li></ul>\n<p>not</p>', '<UL>\n<LI>one</LI>\n<LI>two</LI></UL>\n<P>not</P>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLOutput());
      });
    } else if (Prototype.Browser.Opera) {
      [
        ['<p>One<br />\nTwo</p>\n\n<p>Break</p>',
          '<P>One</P><P>Two</P><P></P><P>Break</P>'],
        ['<p>Here is some basic text...<br />\n...with a line break.</p>\n\n<p>We want to put a paragraph...</p>\n\n<p>...right there.</p>',
          '<p>Here is some basic text...</p>\n<p>...with a line break.</p>\n<p>&nbsp;</p>\n<p>We want to put a paragraph...</p>\n<p>&nbsp;</p>\n<p>...right there.</p>'],
        ['<p>Here is some basic text...<br />\n...with a line break.</p>\n\n<p>We want to put a paragraph...</p>\n\n<p>...right there.</p>',
          '<P>Here is some basic text...</P>\n<P>...with a line break.</P>\n<P> </P>\n<P>We want to put a paragraph...</P>\n<P> </P>\n<P>...right there.</P>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLOutput());
      });
    }
  },

  testFormatForEditor: function() {
    var runner = this;

    if (Prototype.Browser.WebKit) {
      [
        ['<div>Here is some basic text...</div><div>...with a line break.</div><div><br></div><div>We want to put a paragraph...</div><div><br></div><div>...right there.</div>',
          '<p>Here is some basic text...<br />\n...with a line break.</p>\n\n<p>We want to put a paragraph...</p>\n\n<p>...right there.</p>'],

        ['<div>Some <span style="font-weight: bold;" class="Apple-style-span">bold</span> text</div>',
          '<p>Some <strong>bold</strong> text</p>'],
        ['<div>Some <span style="font-style: italic;" class="Apple-style-span">italic</span> text</div>',
          '<p>Some <em>italic</em> text</p>'],
        ['<div>Some <span style="text-decoration: underline;" class="Apple-style-span">underlined</span> text</div>',
          '<p>Some <u>underlined</u> text</p>'],
        ['<div>Some <span style="font-weight: bold;" class="Apple-style-span"><span style="font-style: italic;" class="Apple-style-span">bold and italic</span></span> text</div>',
          '<p>Some <strong><em>bold and italic</em></strong> text</p>'],
        ['<div>Some <span style="font-style: italic;" class="Apple-style-span"><span style="font-weight: bold;" class="Apple-style-span">italic and bold</span></span> text</div>',
          '<p>Some <em><strong>italic and bold</strong></em> text</p>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLInput());
      });
    } else if (Prototype.Browser.Gecko) {
      [
        ['Here is some basic text...<br>...with a line break.<br><br>We want to put a paragraph...<br><br>...right there.<br>',
          '<p>Here is some basic text...<br />\n...with a line break.</p>\n\n<p>We want to put a paragraph...</p>\n\n<p>...right there.</p>'],

        ['Some <span style="font-weight: bold;">bold</span> text<br>',
          '<p>Some <strong>bold</strong> text</p>'],
        ['Some <span style="font-style: italic;">italic</span> text<br>',
          '<p>Some <em>italic</em> text</p>'],
        ['Some <span style="text-decoration: underline;">underlined</span> text<br>',
          '<p>Some <u>underlined</u> text</p>'],
        ['Some <span style="font-weight: bold;"><span style="font-style: italic;">bold and italic</span></span> text<br>',
          '<p>Some <strong><em>bold and italic</em></strong> text</p>'],
        ['Some <span style="font-style: italic;"><span style="font-weight: bold;">italic and bold</span></span> text<br>',
          '<p>Some <em><strong>italic and bold</strong></em> text</p>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLInput());
      });
    } else if (Prototype.Browser.IE) {
      [
        [ '<p>Here is some basic text...</p>\n<p>...with a line break.</p>\n<p>&nbsp;</p>\n<p>We want to put a paragraph...</p>\n<p>&nbsp;</p>\n<p>...right there.</p>',
          '<p>Here is some basic text...<br />\n...with a line break.</p>\n\n<p>We want to put a paragraph...</p>\n\n<p>...right there.</p>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLInput());
      });
    } else if (Prototype.Browser.Opera) {
      [
        [ '<p>Here is some basic text...</p>\n<p>...with a line break.</p>\n<p>&nbsp;</p>\n<p>We want to put a paragraph...</p>\n<p>&nbsp;</p>\n<p>...right there.</p>',
          '<p>Here is some basic text...<br />\n...with a line break.</p>\n\n<p>We want to put a paragraph...</p>\n\n<p>...right there.</p>']
      ].each(function(assertion) {
        runner.assertEqual(assertion[0], assertion[1].formatHTMLInput());
      });
    }
  }
});
