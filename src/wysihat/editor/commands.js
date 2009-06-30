/** section: wysihat
 *  mixin WysiHat.Commands
 *
 *  Methods will be mixed into the editor element. Most of these
 *  methods will be used to bind to button clicks or key presses.
 *
 *  var editor = WysiHat.Editor.attach(textarea);
 *  $('bold_button').observe('click', function(event) {
 *    editor.boldSelection();
 *    Event.stop(event);
 *  });
 *
 *  In this example, it is important to stop the click event so you don't
 *  lose your current selection.
**/
WysiHat.Commands = (function() {
  /**
   *  WysiHat.Commands#boldSelection() -> undefined
   *
   *  Bolds the current selection.
  **/
  function boldSelection() {
    this.execCommand('bold', false, null);
  }

  /**
   *  WysiHat.Commands#boldSelected() -> boolean
   *
   *  Check if current selection is bold or strong.
  **/
  function boldSelected() {
    return this.queryCommandState('bold');
  }

  /**
   *  WysiHat.Commands#underlineSelection() -> undefined
   *
   *  Underlines the current selection.
  **/
  function underlineSelection() {
    this.execCommand('underline', false, null);
  }

  /**
   *  WysiHat.Commands#underlineSelected() -> boolean
   *
   *  Check if current selection is underlined.
  **/
  function underlineSelected() {
    return this.queryCommandState('underline');
  }

  /**
   *  WysiHat.Commands#italicSelection() -> undefined
   *
   *  Italicizes the current selection.
  **/
  function italicSelection() {
    this.execCommand('italic', false, null);
  }

  /**
   *  WysiHat.Commands#italicSelected() -> boolean
   *
   *  Check if current selection is italic or emphasized.
  **/
  function italicSelected() {
    return this.queryCommandState('italic');
  }

  /**
   *  WysiHat.Commands#italicSelection() -> undefined
   *
   *  Strikethroughs the current selection.
  **/
  function strikethroughSelection() {
    this.execCommand('strikethrough', false, null);
  }

  /**
   *  WysiHat.Commands#blockquoteSelection() -> undefined
   *
   *  Blockquotes the current selection.
  **/
  function blockquoteSelection() {
    this.execCommand('blockquote', false, null);
  }

  /**
   * WysiHat.Commands#fontSelection(font) -> undefined
   *
   * Sets the font for the current selection
  **/
  function fontSelection(font) {
    this.execCommand('fontname', false, font);
  }

  /**
   * WysiHat.Commands#fontSelected() -> style string
   *
   * Gets the font for the current selection
  **/
  function fontSelected() {
    var node = this.selection.getNode();
    return Element.getStyle(node, 'fontFamily');
  }
  
  /**
   * WysiHat.Commands#fontSizeSelection(fontSize) -> undefined
   * - font size (int) : font size for selection
   *
   * Sets the font size for the current selection
  **/
  function fontSizeSelection(fontSize) {
    this.execCommand('fontsize', false, fontSize);
  }

  /**
   * WysiHat.Commands#fontSizeSelected() -> Returns a fontsize, standardized for modern browsers
   *
   * Gets the font size for the current selection
  **/
  function fontSizeSelected() {
    var node = this.selection.getNode();
    return standardizeFontSize(Element.getStyle(node, 'fontSize'));
  }

  /**
   *  WysiHat.Commands#colorSelection(color) -> undefined
   *  - color (String): a color name or hexadecimal value
   *
   *  Sets the foreground color of the current selection.
  **/
  function colorSelection(color) {
    this.execCommand('forecolor', false, color);
  }

  /**
   * WysiHat.Commands#colorSelected() -> string (color)
   * 
   * Returns the color of the selected portion
  **/
   function colorSelected() {
     var node = this.selection.getNode();
     return standardizeColor(Element.getStyle(node, 'color'));
   }

  /**
   *  WysiHat.Commands#backgroundColorSelection(color) -> undefined
   *  - color (string) - a color or hexadecimal value
   *  
   * Sets the background color.  Firefox will fill in the background
   * color of the entire iframe unless hilitecolor is used.
  **/
  function backgroundColorSelection(color) {
    if(Prototype.Browser.Gecko) {
      this.execCommand('hilitecolor', false, color);
    } else {
      this.execCommand('backcolor', false, color);
    }
  }

  /**
   *  WysiHat.Commands#backgroundColorSelected() -> color
   *
   *  Returns the background color of the selected text area
  **/
  function backgroundColorSelected() {
    var node = this.selection.getNode();
    return standardizeColor(Element.getStyle(node, 'backgroundColor'));
  }

  /**
   *  WysiHat.Commands#alignSelection(color) -> undefined
   *  - alignment (string) - how the text should be aligned (left, center, right)
   *  
  **/
  function alignSelection(alignment) {
    this.execCommand('justify' + alignment);
  }

  /**
   *  WysiHat.Commands#backgroundColorSelected() -> alignment
   *
   *  Returns the alignment of the selected text area
  **/
  function alignSelected() {
    var node = this.selection.getNode();
    return Element.getStyle(node, 'textAlign');
  }

  /**
   *  WysiHat.Commands#linkSelection(url) -> undefined
   *  - url (String): value for href
   *
   *  Wraps the current selection in a link.
  **/
  function linkSelection(url) {
    this.execCommand('createLink', false, url);
  }

  /**
   *  WysiHat.Commands#unlinkSelection() -> undefined
   *
   *  Selects the entire link at the cursor and removes it
  **/
  function unlinkSelection() {
    var node = this.selection.getNode();
    if (this.linkSelected())
      this.selection.selectNode(node);

    this.execCommand('unlink', false, null);
  }

  /**
   *  WysiHat.Commands#linkSelected() -> boolean
   *
   *  Check if current selection is link.
  **/
  function linkSelected() {
    var node = this.selection.getNode();
    return node ? node.tagName.toUpperCase() == 'A' : false;
  }

  /**
   *  WysiHat.Commands#insertOrderedList() -> undefined
   *
   *  Formats current selection as an ordered list. If the selection is empty
   *  a new list is inserted.
  **/
  function insertOrderedList() {
    this.execCommand('insertorderedlist', false, null);
  }

  /**
   *  WysiHat.Commands#insertUnorderedList() -> undefined
   *
   *  Formats current selection as an unordered list. If the selection is empty
   *  a new list is inserted.
  **/
  function insertUnorderedList() {
    this.execCommand('insertunorderedlist', false, null);
  }

  /**
   *  WysiHat.Commands#insertImage(url) -> undefined
   *
   *  - url (String): value for src
   *  Insert an image at the insertion point with the given url.
  **/
  function insertImage(url) {
    this.execCommand('insertImage', false, url);
  }

  /**
   *  WysiHat.Commands#insertHTML(html) -> undefined
   *
   *  - html (String): HTML or plain text
   *  Insert HTML at the insertion point.
  **/
  function insertHTML(html) {
    if (Prototype.Browser.IE) {
      var range = this._selection.getRange();
      range.pasteHTML(html);
      range.collapse(false);
      range.select();
    } else {
      this.execCommand('insertHTML', false, html);
    }
  }

  /**
   *  WysiHat.Commands#execCommand(command[, ui = false][, value = null]) -> undefined
   *  - command (String): Command to execute
   *  - ui (Boolean): Boolean flag for showing UI. Currenty this not
   *    implemented by any browser. Just use false.
   *  - value (String): Value to pass to command
   *
   *  A simple delegation method to the documents execCommand method.
  **/
  function execCommand(command, ui, value) {
    var document = this.getDocument();

    if (Prototype.Browser.IE) this.selection.restore();

    var handler = this.commands.get(command)
    if (handler)
      handler.bind(this)(value);
    else
      document.execCommand(command, ui, value);
  }

  /**
   *  WysiHat.Commands#queryCommandState(state) -> Boolean
   *  - state (String): bold, italic, underline, etc
   *
   *  A delegation method to the document's queryCommandState method.
   *
   *  Custom states handlers can be added to the queryCommands hash,
   *  which will be checked before calling the native queryCommandState
   *  command.
   *
   *  editor.queryCommands.set("link", editor.linkSelected);
  **/
  function queryCommandState(state) {
    var document = this.getDocument();

    var handler = this.queryCommands.get(state)
    if (handler)
      return handler.bind(this)();
    else
      return document.queryCommandState(state);
  }
  /**
   *  fontSizes for Safari, Gecko, and IE are all a different.
  **/
  var fontSizeNames = $w('xxx-small xx-small x-small small medium large x-large xx-large');
  var fontSizePixels = $w('9px 10px 13px 16px 18px 24px 32px 48px');

  if (Prototype.Browser.WebKit) {
    fontSizeNames.shift();
    fontSizeNames.push('-webkit-xxx-large');
  }

  /**
   *  WysiHat.Commands#standardizeFontSize(fontSize) -> int
   *
   *  Returns a standard font size from the three modern browsers.
   *
  **/
  function standardizeFontSize(fontSize) {
    var newSize = fontSizeNames.indexOf(fontSize);
    if (newSize >= 0) return newSize;

    newSize = fontSizePixels.indexOf(fontSize);
    if (newSize >= 0) return newSize;
    return parseInt(fontSize);
  }

  function standardizeColor(color) {
    if (!color || color.match(/[0-9a-f]{6}/i)) return color;
    var m = color.toLowerCase().match(/^(rgba?|hsla?)\(([\s\.\-,%0-9]+)\)/);
    if(m){
      var c = m[2].split(/\s*,\s*/), l = c.length, t = m[1];
      if((t == "rgb" && l == 3) || (t == "rgba" && l == 4)){
        var r = c[0];
        if(r.charAt(r.length - 1) == "%"){
          var a = c.map(function(x){
            return parseFloat(x) * 2.56;
          });
          if(l == 4){ a[3] = c[3]; }
          return _colorFromArray(a);
        }
        return _colorFromArray(c);
      }
      if((t == "hsl" && l == 3) || (t == "hsla" && l == 4)){
        var H = ((parseFloat(c[0]) % 360) + 360) % 360 / 360,
          S = parseFloat(c[1]) / 100,
          L = parseFloat(c[2]) / 100,
          m2 = L <= 0.5 ? L * (S + 1) : L + S - L * S,
          m1 = 2 * L - m2,
          a = [_hue2rgb(m1, m2, H + 1 / 3) * 256,
            _hue2rgb(m1, m2, H) * 256, _hue2rgb(m1, m2, H - 1 / 3) * 256, 1];
        if(l == 4){ a[3] = c[3]; }
        return _colorFromArray(a);
      }
    }
    return null;  // dojo.Color
  }

  function _colorFromArray(a) {
    var arr = a.slice(0, 3).map(function(x){
      var s = parseInt(x).toString(16);
      return s.length < 2 ? "0" + s : s;
    });
    return "#" + arr.join("");  // String
  }

  function _hue2rgb(m1, m2, h){
     if(h < 0){ ++h; }
     if(h > 1){ --h; }
     var h6 = 6 * h;
     if(h6 < 1){ return m1 + (m2 - m1) * h6; }
     if(2 * h < 1){ return m2; }
     if(3 * h < 2){ return m1 + (m2 - m1) * (2 / 3 - h) * 6; }
     return m1;
   }

  return {
     boldSelection:                    boldSelection,
     boldSelected:                     boldSelected,
     underlineSelection:               underlineSelection,
     underlineSelected:                underlineSelected,
     italicSelection:                  italicSelection,
     italicSelected:                   italicSelected,
     strikethroughSelection:           strikethroughSelection,
     blockquoteSelection:              blockquoteSelection,
     fontSelection:                    fontSelection,
     fontSelected:                     fontSelected,
     fontSizeSelection:                fontSizeSelection,
     fontSizeSelected:                 fontSizeSelected,
     colorSelection:                   colorSelection,
     colorSelected:                    colorSelected,
     backgroundColorSelection:         backgroundColorSelection,
     backgroundColorSelected:          backgroundColorSelected,
     alignSelection:                   alignSelection,
     alignSelected:                    alignSelected,
     linkSelection:                    linkSelection,
     unlinkSelection:                  unlinkSelection,
     linkSelected:                     linkSelected,
     insertOrderedList:                insertOrderedList,
     insertUnorderedList:              insertUnorderedList,
     insertImage:                      insertImage,
     insertHTML:                       insertHTML,
     execCommand:                      execCommand,
     queryCommandState:                queryCommandState,

    commands: $H({}),

    queryCommands: $H({
      link: linkSelected
    })
  };
})();

WysiHat.Editor.include(WysiHat.Commands);
