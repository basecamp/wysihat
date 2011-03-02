//= require "./dom/selection"
//= require "./events/field_change"

/** section: wysihat
 *  mixin WysiHat.Commands
 *
 *  Methods will be mixed into the editor element. Most of these
 *  methods will be used to bind to button clicks or key presses.
 *
 *  var editor = WysiHat.Editor.attach(textarea);
 *  $('bold_button').on('click', function(event) {
 *    editor.boldSelection();
 *    event.stop();
 *  });
 *
 *  In this example, it is important to stop the click event so you don't
 *  lose your current selection.
**/
WysiHat.Commands = (function(window) {
  /**
   *  WysiHat.Commands#h1Selection() -> undefined
   *
   *  Wraps the current selection in a h1 tag.
  **/
  function h1Selection() {
    headingSelection(this, 'h1');
  }	

  /**
   *  WysiHat.Commands#h2Selection() -> undefined
   *
   *  Wraps the current selection in a h2 tag.
  **/
  function h2Selection() {
    headingSelection(this, 'h2');
  }	

  /**
   *  WysiHat.Commands#h3Selection() -> undefined
   *
   *  Wraps the current selection in a h3 tag.
  **/
  function h3Selection() {
    headingSelection(this, 'h3');
  }	

  /**
   *  WysiHat.Commands#h4Selection() -> undefined
   *
   *  Wraps the current selection in a h4 tag.
  **/
  function h4Selection() {
    headingSelection(this, 'h4');
  }	

  /**
   *  WysiHat.Commands#h5Selection() -> undefined
   *
   *  Wraps the current selection in a h5 tag.
  **/
  function h5Selection() {
    headingSelection(this, 'h5');
  }	

  /**
   *  WysiHat.Commands#h6Selection() -> undefined
   *
   *  Wraps the current selection in a h6 tag.
  **/
  function h6Selection() {
    headingSelection(this, 'h6');
  }	
  
  /**
   *  WysiHat.Commands#headingSelection() -> undefined
   *
   *  Wraps the current selection in the provided header tag unless it is already wrapped then it will remove the header tags.
  **/
  function headingSelection(_this, heading) {
    var node = get_node_or_parent_if(function(element) { return element == '[object HTMLHeadingElement]' && element.tagName.toLowerCase() == heading; });
    if (node !== undefined) {
      remove_outer_node(_this, node);
      return;
    }
    
    _this.execCommand('formatblock', false, '<'+ heading +'>');
  }
  
  /**
   *  WysiHat.Commands#pSelection() -> undefined
   *
   *  Wraps the current selection in a p tag unless it is already wrapped then it will remove the p tag.
  **/
  function pSelection() {
    var node = get_node_or_parent_if(function(element) { return element == '[object HTMLParagraphElement]'; });
    if (node !== undefined) {
      remove_outer_node(this, node);
      return;
    }
    
    this.execCommand('formatblock', false, '<p>');
  }	

  /**
   *  WysiHat.Commands#get_node_or_parent_if() -> node || undefined
   *
   *  Returns the selected node or its parent if it or its parent match the provided filter
  **/
  function get_node_or_parent_if(selector) {
	  var element = window.getSelection().getNode();

    if (selector(element)) {
      return element;
    }
    
    if (selector(element.parentNode)) {
      return element.parentNode;
    }
  }

  /**
   *  WysiHat.Commands#remove_outer_node() -> undefined
   *
   *  Will remove the outer nodes from the selected range
  **/
  function remove_outer_node(_this, selectedNode) {
    var selection, range, node, parent;

    selection  = window.getSelection();
    node       = selection.getNode();
    parent     = selectedNode.parentNode;
    range      = selection.getRangeAt(0);
    
    capture_cursor(range);
    
    range.selectNodeContents(selectedNode);
    content    = range.cloneContents();
    
    if (Prototype.Browser.Gecko) {
      content.appendChild(document.createElement("br"));
      parent.replaceChild(content, selectedNode);
    } else {
      div = document.createElement("div");
      div.appendChild(content);  
      parent.replaceChild(div, selectedNode);
    }

    _this.focus();
    restore_cursor(selection);
  }
  
  /**
   *  WysiHat.Commands#capture_cursor() -> undefined
   *
   *  Inserts a temporarly node where the current selection is
   *  Adapted from: http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
  **/
  function capture_cursor(range) {
    var cursorStart = document.createElement('span');
    var collapsed = !!range.collapsed;

    cursorStart.id = 'cursorStart';
    cursorStart.appendChild(document.createTextNode('—'));
    range.insertNode(cursorStart);

    if(!collapsed) {
      var cursorEnd = document.createElement('span');
      cursorEnd.id = 'cursorEnd';
      range.collapse(true);
      range.insertNode(cursorEnd);
    }
  }
  
  /**
   *  WysiHat.Commands#restore_cursor() -> undefined
   *
   *  Finds the nodes inserted by capture_cursor and creates the current selection from it and then removes them
   *  Adapted from: http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
  **/
  function restore_cursor(selection) {
    setTimeout(function() {
      var cursorStart = document.getElementById('cursorStart');
      var cursorEnd = document.getElementById('cursorEnd');

      if(cursorStart) {
        var range = document.createRange();

        if(cursorEnd) {
          range.setStartAfter(cursorStart);
          range.setEndBefore(cursorEnd);

          // Delete cursor markers
          cursorStart.parentNode.removeChild(cursorStart);
          cursorEnd.parentNode.removeChild(cursorEnd);

          // Select range
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          range.selectNode(cursorStart);

          // Select range
          selection.removeAllRanges();
          selection.addRange(range);

          // Delete cursor marker
          document.execCommand('delete', false, null);
        }
      }
    }, 10);
  }

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
   *  WysiHat.Commands#indentSelection() -> undefined
   *
   *  Indents the current selection.
  **/
  function indentSelection() {
    // TODO: Should use feature detection
    if (Prototype.Browser.Gecko) {
      var selection, range, node, blockquote;

      selection = window.getSelection();
      range     = selection.getRangeAt(0);
      node      = selection.getNode();

      if (range.collapsed) {
        range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      blockquote = new Element('blockquote');
      range = selection.getRangeAt(0);
      range.surroundContents(blockquote);
    } else {
      this.execCommand('indent', false, null);
    }
  }

  /**
   *  WysiHat.Commands#outdentSelection() -> undefined
   *
   *  Outdents the current selection.
  **/
  function outdentSelection() {
    this.execCommand('outdent', false, null);
  }

  /**
   *  WysiHat.Commands#toggleIndentation() -> undefined
   *
   *  Toggles indentation the current selection.
  **/
  function toggleIndentation() {
    if (this.indentSelected()) {
      this.outdentSelection();
    } else {
      this.indentSelection();
    }
  }

  /**
   *  WysiHat.Commands#indentSelected() -> boolean
   *
   *  Check if current selection is indented.
  **/
  function indentSelected() {
    var node = window.getSelection().getNode();
    return node.match("blockquote, blockquote *");
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
   * WysiHat.Commands#fontSizeSelection(fontSize) -> undefined
   * - font size (int) : font size for selection
   *
   * Sets the font size for the current selection
  **/
  function fontSizeSelection(fontSize) {
    this.execCommand('fontsize', false, fontSize);
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
    var node = window.getSelection().getNode();
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
    var node = window.getSelection().getNode();
    if (this.linkSelected())
      window.getSelection().selectNode(node);

    this.execCommand('unlink', false, null);
  }

  /**
   *  WysiHat.Commands#linkSelected() -> boolean
   *
   *  Check if current selection is link.
  **/
  function linkSelected() {
    var node = window.getSelection().getNode();
    return node ? node.tagName.toUpperCase() == 'A' : false;
  }

  /**
   *  WysiHat.Commands#formatblockSelection(element) -> undefined
   *  - element (String): the type of element you want to wrap your selection
   *    with (like 'h1' or 'p').
   *
   *  Wraps the current selection in a header or paragraph.
  **/
  function formatblockSelection(element){
    this.execCommand('formatblock', false, element);
  }

  /**
   *  WysiHat.Commands#toggleOrderedList() -> undefined
   *
   *  Formats current selection as an ordered list. If the selection is empty
   *  a new list is inserted.
   *
   *  If the selection is already a ordered list, the entire list
   *  will be toggled. However, toggling the last item of the list
   *  will only affect that item, not the entire list.
  **/
  function toggleOrderedList() {
    var selection, node;

    selection = window.getSelection();
    node      = selection.getNode();

    if (this.orderedListSelected() && !node.match("ol li:last-child, ol li:last-child *")) {
      selection.selectNode(node.up("ol"));
    } else if (this.unorderedListSelected()) {
      // Toggle list type
      selection.selectNode(node.up("ul"));
    }

    this.execCommand('insertorderedlist', false, null);
  }

  /**
   *  WysiHat.Commands#insertOrderedList() -> undefined
   *
   *  Alias for WysiHat.Commands#toggleOrderedList
  **/
  function insertOrderedList() {
    this.toggleOrderedList();
  }

  /**
   *  WysiHat.Commands#orderedListSelected() -> boolean
   *
   *  Check if current selection is within an ordered list.
  **/
  function orderedListSelected() {
    var element = window.getSelection().getNode();
    if (element) return element.match('*[contenteditable=""] ol, *[contenteditable=true] ol, *[contenteditable=""] ol *, *[contenteditable=true] ol *');
    return false;
  }

  /**
   *  WysiHat.Commands#toggleUnorderedList() -> undefined
   *
   *  Formats current selection as an unordered list. If the selection is empty
   *  a new list is inserted.
   *
   *  If the selection is already a unordered list, the entire list
   *  will be toggled. However, toggling the last item of the list
   *  will only affect that item, not the entire list.
  **/
  function toggleUnorderedList() {
    var selection, node;

    selection = window.getSelection();
    node      = selection.getNode();

    if (this.unorderedListSelected() && !node.match("ul li:last-child, ul li:last-child *")) {
      selection.selectNode(node.up("ul"));
    } else if (this.orderedListSelected()) {
      // Toggle list type
      selection.selectNode(node.up("ol"));
    }

    this.execCommand('insertunorderedlist', false, null);
  }

  /**
   *  WysiHat.Commands#insertUnorderedList() -> undefined
   *
   *  Alias for WysiHat.Commands#toggleUnorderedList()
  **/
  function insertUnorderedList() {
    this.toggleUnorderedList();
  }

  /**
   *  WysiHat.Commands#unorderedListSelected() -> boolean
   *
   *  Check if current selection is within an unordered list.
  **/
  function unorderedListSelected() {
    var element = window.getSelection().getNode();
    if (element) return element.match('*[contenteditable=""] ul, *[contenteditable=true] ul, *[contenteditable=""] ul *, *[contenteditable=true] ul *');
    return false;
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
      var range = window.document.selection.createRange();
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
    var handler = this.commands.get(command);
    if (handler) {
      handler.bind(this)(value);
    } else {
      try {
        window.document.execCommand(command, ui, value);
      } catch(e) { return null; }
    }

    document.activeElement.fire("field:change");

    if (Prototype.Browser.Gecko) {
      this.focus();
    }
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
    var handler = this.queryCommands.get(state);
    if (handler) {
      return handler.bind(this)();
    } else {
      try {
        return window.document.queryCommandState(state);
      } catch(e) { return null; }
    }
  }

  /**
   *  WysiHat.Commands#getSelectedStyles() -> Hash
   *
   *  Fetches the styles (from the styleSelectors hash) from the current
   *  selection and returns it as a hash
  **/
  function getSelectedStyles() {
    var styles = $H({});
    var editor = this;
    editor.styleSelectors.each(function(style){
      var node = editor.selection.getNode();
      styles.set(style.first(), Element.getStyle(node, style.last()));
    });
    return styles;
  }

  return {
     pSelection:               pSelection,
     h1Selection:              h1Selection,
     h2Selection:              h2Selection,
     h3Selection:              h3Selection,
     h4Selection:              h4Selection,
     h5Selection:              h5Selection,
     h6Selection:              h6Selection,
     boldSelection:            boldSelection,
     boldSelected:             boldSelected,
     underlineSelection:       underlineSelection,
     underlineSelected:        underlineSelected,
     italicSelection:          italicSelection,
     italicSelected:           italicSelected,
     strikethroughSelection:   strikethroughSelection,
     indentSelection:          indentSelection,
     outdentSelection:         outdentSelection,
     toggleIndentation:        toggleIndentation,
     indentSelected:           indentSelected,
     fontSelection:            fontSelection,
     fontSizeSelection:        fontSizeSelection,
     colorSelection:           colorSelection,
     backgroundColorSelection: backgroundColorSelection,
     alignSelection:           alignSelection,
     alignSelected:            alignSelected,
     linkSelection:            linkSelection,
     unlinkSelection:          unlinkSelection,
     linkSelected:             linkSelected,
     formatblockSelection:     formatblockSelection,
     toggleOrderedList:        toggleOrderedList,
     insertOrderedList:        insertOrderedList,
     orderedListSelected:      orderedListSelected,
     toggleUnorderedList:      toggleUnorderedList,
     insertUnorderedList:      insertUnorderedList,
     unorderedListSelected:    unorderedListSelected,
     insertImage:              insertImage,
     insertHTML:               insertHTML,
     execCommand:              execCommand,
     queryCommandState:        queryCommandState,
     getSelectedStyles:        getSelectedStyles,

    commands: $H({}),

    queryCommands: $H({
      link:          linkSelected,
      orderedlist:   orderedListSelected,
      unorderedlist: unorderedListSelected
    }),

    styleSelectors: $H({
      fontname:    'fontFamily',
      fontsize:    'fontSize',
      forecolor:   'color',
      hilitecolor: 'backgroundColor',
      backcolor:   'backgroundColor'
    })
  };
})(window);
