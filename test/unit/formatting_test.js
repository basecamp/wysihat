function getBrowserMarkupFrom(html) {
  return WysiHat.Formatting.getBrowserMarkupFrom(html);
}

function getApplicationMarkupFrom(html) {
  var element = new Element("div").update(html);
  return WysiHat.Formatting.getApplicationMarkupFrom(element);
}

new Test.Unit.Runner({
  testGetBrowserMarkupFrom: function() {
    var runner = this;

    if (Prototype.Browser.WebKit) {
      runner.assertEqual(
        '<div>Here is some basic text</div><div>with a line break.</div><div class="paragraph_break"><br></div><div>And maybe another paragraph</div>',
        getBrowserMarkupFrom('<div>Here is some basic text</div><div>with a line break.</div><div class=\"paragraph_break\"><br /></div><div>And maybe another paragraph</div>')
      );
      runner.assertEqual(
        '<div>Some <span style="font-weight: bold" class="Apple-style-span">bold</span> text</div>"',
        getBrowserMarkupFrom('<div>Some <strong>bold</strong> text</div>"')
      );
    } else if (Prototype.Browser.Gecko) {
      runner.assertEqual(
        '<div>Here is some basic text</div><div>with a line break.</div><div class="paragraph_break"><br></div><div>And maybe another paragraph</div>',
        getBrowserMarkupFrom('<div>Here is some basic text</div><div>with a line break.</div><div class=\"paragraph_break\"><br /></div><div>And maybe another paragraph</div>')
      );
      runner.assertEqual(
        '<div>Some <span style="font-weight: bold;" class="Apple-style-span">bold</span> text</div>"',
        getBrowserMarkupFrom('<div>Some <strong>bold</strong> text</div>"')
      );
    } else if (Prototype.Browser.IE) {
      runner.assertEqual(
        '<P>Here is some basic text</P>\r\n<P>with a line break.</P>\r\n<P><BR></P>\r\n<P>And maybe another paragraph</P>',
        getBrowserMarkupFrom('<div>Here is some basic text</div><div>with a line break.</div><div class=\"paragraph_break\"><br /></div><div>And maybe another paragraph</div>')
      );
      runner.assertEqual(
        '<P>Some <STRONG>bold</STRONG> text</P>"',
        getBrowserMarkupFrom('<div>Some <strong>bold</strong> text</div>"')
      );
   }
  },

  testGetApplicationMarkupFrom: function() {
    var runner = this;

    if (Prototype.Browser.WebKit) {
      runner.assertEqual(
        '<div>Here is some basic text</div><div>with a line break.</div><div><br></div><div>And maybe another paragraph</div>',
        getApplicationMarkupFrom('<div>Here is some basic text</div><div>with a line break.</div><div><br></div><div>And maybe another paragraph</div>')
      );
      runner.assertEqual(
        '<div>Hello</div><div><br></div><div>World!</div>',
        getApplicationMarkupFrom('<div>Hello</div><div><br></div><div>World!</div>')
      );
      runner.assertEqual(
        '<div>Hello</div><div><br></div><div>World!</div>',
        getApplicationMarkupFrom('<div><p>Hello</p></div><div><br></div><div>World!</div>')
      );
      runner.assertEqual(
        '<div>Hello<br></div><div><br></div><div><br></div><div>World!</div>',
        getApplicationMarkupFrom('<div>Hello<p></p></div><div><p></p></div><div><p></p></div><div><p>World!</p></div>')
      );
      runner.assertEqual(
        '<div>Hello</div><div>World!<br></div><div>Goodbye!</div>',
        getApplicationMarkupFrom('Hello<div><div><div>World!<br></div><div>Goodbye!</div></div></div>')
      );
      runner.assertEqual(
        '<div>Hello</div><div>World!</div><div>Goodbye!</div>',
        getApplicationMarkupFrom('Hello<div><div><div><div>World!</div><div>Goodbye!</div></div></div></div>')
      );
      runner.assertEqual(
        '<div>Hello</div><div><br></div><div>World!<br></div><div>Goodbye!</div>',
        getApplicationMarkupFrom('Hello<div><br><div><div><div>World!<br></div><div>Goodbye!</div></div></div></div>')
      );
      runner.assertEqual(
        '<div>Hello</div><div>World!</div><div><br></div><div>Goodbye!</div>',
        getApplicationMarkupFrom('Hello<div><div><div><div>World!<br></div><div><br></div><div>Goodbye!</div></div></div></div>')
      );
      runner.assertEqual(
        '<div>Some <strong>bold</strong> text</div>',
        getApplicationMarkupFrom('Some <span class="Apple-style-span" style="font-weight: bold;">bold</span> text')
      );
      runner.assertEqual(
        '<div>Some <em>italic</em> text</div>',
        getApplicationMarkupFrom('Some <span class="Apple-style-span" style="font-style: italic;">italic</span> text')
      );
      runner.assertEqual(
        '<div>Some <span class="Apple-style-span" style="text-decoration: underline;">underlined</span> text</div>',
        getApplicationMarkupFrom('Some <span class="Apple-style-span" style="text-decoration: underline;">underlined</span> text')
      );
      runner.assertEqual(
        '<div>Some <strong><em>bold and italic</em></strong> text</div>',
        getApplicationMarkupFrom('Some <span class="Apple-style-span" style="font-weight: bold;"><span class="Apple-style-span" style="font-style: italic;">bold and italic</span></span> text')
      );
      runner.assertEqual(
        '<div>Some <em><strong>italic and bold</strong></em> text</div>',
        getApplicationMarkupFrom('Some <span class="Apple-style-span" style="font-style: italic;"><span class="Apple-style-span" style="font-weight: bold;">italic and bold</span></span> text')
      );
      runner.assertEqual(
        '<div>Some <strong><span class="Apple-style-span" style="text-decoration: underline;"><em>bold, underlined, and italic</em></span></strong> text</div>',
        getApplicationMarkupFrom('Some <span class="Apple-style-span" style="font-weight: bold;"><span class="Apple-style-span" style="text-decoration: underline;"><span class="Apple-style-span" style="font-style: italic;">bold, underlined, and italic</span></span></span> text')
      );
      runner.assertEqual(
        '<div>Hello</div><div> <strong></strong></div>',
        getApplicationMarkupFrom('<div>Hello</div><div> <span class="Apple-style-span" style="font-weight: bold;"></span></div>')
      );
      runner.assertEqual(
        '<div>Hello<span id="bookmark"> </span></div>',
        getApplicationMarkupFrom('<div>Hello<span id="bookmark"> </span></div>')
      );
      runner.assertEqual(
        '<div><img src="http://www.google.com/intl/en_ALL/images/logo.gif"></div>',
        getApplicationMarkupFrom('<img src="http://www.google.com/intl/en_ALL/images/logo.gif">')
      );
      runner.assertEqual(
        '<ol><li>one</li><li>two</li></ol><div>not</div>',
        getApplicationMarkupFrom('<ol><li>one</li><li>two</li></ol><div>not</div>')
      );
      runner.assertEqual(
        '<ul><li>one</li><li>two</li></ul><div>not</div>',
        getApplicationMarkupFrom('<ul><li>one</li><li>two</li></ul><div>not</div>')
      );
    } else if (Prototype.Browser.Gecko) {
      runner.assertEqual(
        '<div>Here is some basic text<br></div><div>with a line break.</div><div><br></div><div>And maybe another paragraph<br></div>',
        getApplicationMarkupFrom('Here is some basic text<br>with a line break.<br><br>And maybe another paragraph<br>')
      );
      runner.assertEqual(
        '<div>Here is some basic text<br></div><div>with a line break.<br></div><div></div><div><br></div><div>And maybe another paragraph<br></div>',
        getApplicationMarkupFrom('Here is some basic text<br>with a line break.<br><p></p><br>And maybe another paragraph<br>')
      );
      runner.assertEqual(
        '<div>Hello</div><div><br></div><div>World!</div>',
        getApplicationMarkupFrom('Hello<br><br>World!')
      );
      runner.assertEqual(
        '<div>Hello<br></div><div>World!<br></div><div>Goodbye!<br></div>',
        getApplicationMarkupFrom('Hello<br>World!<br>Goodbye!<br>')
      );
      runner.assertEqual(
        '<div>Hello<br></div><div>World!</div><div><br></div><div>Goodbye!<br></div>',
        getApplicationMarkupFrom('Hello<br>World!<br><br>Goodbye!<br>')
      );
      runner.assertEqual(
        '<div>Some <strong>bold</strong> text</div>',
        getApplicationMarkupFrom('Some <span style="font-weight: bold;">bold</span> text')
      );
      runner.assertEqual(
        '<div>Some <em>italic</em> text</div>',
        getApplicationMarkupFrom('Some <span style="font-style: italic;">italic</span> text')
      );
      runner.assertEqual(
        '<div>Some <span style="text-decoration: underline;">underlined</span> text</div>',
        getApplicationMarkupFrom('Some <span style="text-decoration: underline;">underlined</span> text')
      );
      runner.assertEqual(
        '<div>Some <strong>bold and italic</strong> text</div>', // BROKEN
        getApplicationMarkupFrom('Some <span style="font-weight: bold; font-style: italic;">bold and italic</span> text')
      );
      runner.assertEqual(
        '<div>Some <strong>italic and bold</strong> text</div>', // BROKEN
        getApplicationMarkupFrom('Some <span style="font-style: italic; font-weight: bold;">italic and bold</span> text')
      );
      runner.assertEqual(
        '<div>Some <strong>bold, underline, and italic</strong> text</div>', // BROKEN
        getApplicationMarkupFrom('Some <span style="font-weight: bold; text-decoration: underline; font-style: italic;">bold, underline, and italic</span> text')
      );
      runner.assertEqual(
        '<div><img src="http://www.google.com/intl/en_ALL/images/logo.gif"></div>',
        getApplicationMarkupFrom('<img src="http://www.google.com/intl/en_ALL/images/logo.gif">')
      );
      runner.assertEqual(
        '<ol><li>one</li><li>two</li></ol><div>not<br></div>',
        getApplicationMarkupFrom('<ol><li>one</li><li>two</li></ol>not<br>')
      );
      runner.assertEqual(
        '<ul><li>one</li><li>two</li></ul><div>not<br></div>',
        getApplicationMarkupFrom('<ul><li>one</li><li>two</li></ul>not<br>')
      );
    } else if (Prototype.Browser.IE) {
      runner.assertEqual(
        '<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P></P>')
      );
      runner.assertEqual(
        '<DIV><BR></DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P></P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV><BR></DIV>\r\n<DIV>&nbsp;</DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P>\n<P>&nbsp;</P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV>&nbsp;</DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P>&nbsp;</P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV><BR></DIV>\r\n<DIV>One</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>Two</DIV>\r\n<DIV><BR></DIV>\r\n<DIV><BR></DIV>\r\n<DIV>Break</DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P>\n<P>One</P><BR>\n<P>Two</P>\n<P></P>\n<P>\n<P>Break</P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV><BR></DIV>\r\n<DIV>Here is some basic text</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>with a line break.</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>&nbsp;</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>And maybe another paragraph</DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P>\n<P>Here is some basic text</P><BR>\n<P>with a line break.</P><BR>\n<P>&nbsp;</P><BR>\n<P>And maybe another paragraph</P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV><BR></DIV>\r\n<DIV>Hello</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>&nbsp;</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>World!</DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P>\n<P>Hello</P><BR>\n<P>&nbsp;</P><BR>\n<P>World!</P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV><BR></DIV>\r\n<DIV>Hello</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>World!</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>Goodbye!</DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P>\n<P>Hello</P><BR>\n<P>World!</P><BR>\n<P>Goodbye!</P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV><BR></DIV>\r\n<DIV>Hello</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>World!</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>&nbsp;</DIV>\r\n<DIV><BR></DIV>\r\n<DIV>Goodbye!</DIV>\r\n<DIV><BR></DIV>',
        getApplicationMarkupFrom('<P>\n<P>Hello</P><BR>\n<P>World!</P><BR>\n<P>&nbsp;</P><BR>\n<P>Goodbye!</P>\n<P></P>')
      );
      runner.assertEqual(
        '<DIV>Some <STRONG>bold</STRONG> text</DIV>',
        getApplicationMarkupFrom('Some <STRONG>bold</STRONG> text')
      );
      runner.assertEqual(
        '<DIV>Some <EM>italic</EM> text</DIV>',
        getApplicationMarkupFrom('Some <EM>italic</EM> text')
      );
      runner.assertEqual(
        '<DIV>Some <U>underlined</U> text</DIV>',
        getApplicationMarkupFrom('Some <U>underlined</U> text')
      );
      runner.assertEqual(
        '<OL>\r\n<LI>one</LI>\r\n<LI>two</LI></OL>\r\n<DIV>not</DIV>',
        getApplicationMarkupFrom('<OL>\n<LI>one</LI>\n<LI>two</LI></OL>\n<P>not</P>')
      );
      runner.assertEqual(
        '<UL>\r\n<LI>one</LI>\r\n<LI>two</LI></UL>\r\n<DIV>not</DIV>',
        getApplicationMarkupFrom('<UL>\n<LI>one</LI>\n<LI>two</LI></UL>\n<P>not</P>')
      );
    }
  }
});
