/** section: wysihat
 * class WysiHat.Toolbar
 **/
WysiHat.Toolbar = Class.create((function() {
  /**
   * new WysiHat.Toolbar(editor[, options])
   * - editor (WysiHat.Editor): the editor object that you want to attach to
   * - options (Hash): options for configuring the Toolbar
   *
   *  Creates a toolbar element above the editor. The WysiHat.Toolbar object
   *  has many helper methods to easily add buttons to the toolbar.
   *
   *  This toolbar class is not required for the Editor object to function.
   *  It is merely a set of helper methods to get you started and to build
   *  on top of.
   *
   *  The options hash accepts a few configuration options.
   *  - position (String): before, after, top, or bottom
   *  - container (String | Element): an id or DOM node of the element to
   *     insert the Toolbar into. It is inserted before the editor by default.
   **/
  function initialize(editor, options) {
    options = $H(options);

    this.editor = editor;
    this.element = new Element('div', { 'class': 'editor_toolbar' });

    insertToolbar(this, options);
  }

  function insertToolbar(toolbar, options) {
    var position = options.get('position') || 'before';
    var container = options.get('container') || toolbar.editor;

    var insertOptions = $H({});
    insertOptions.set(position, toolbar.element);
    $(container).insert(insertOptions.toObject());
  }

  /**
   * WysiHat.Toolbar#addButtonSet(set) -> undefined
   *  - set (Array): The set array contains nested arrays that hold the
   *  button options, and handler.
   *
   *  Adds a button set to the toolbar.
   *
   *  WysiHat.Toolbar.ButtonSets.Basic is a built in button set,
   *  that looks like:
   *  [
   *    [{ name: 'bold', label: "Bold" }, function(editor) {
   *      editor.boldSelection();
   *    }],
   *    [{ name: 'underline', label: "Underline" }, function(editor) {
   *      editor.underlineSelection();
   *    }],
   *    [{ name: 'italic', label: "Italic" }, function(editor) {
   *      editor.italicSelection();
   *    }]
   *  ]
   **/
  function addButtonSet(set) {
    var toolbar = this;
    $A(set).each(function(button){
      toolbar.addButton(button);
    });

    return this;
  }

  /**
   * WysiHat.Toolbar#addButton(options, handler) -> undefined
   * - options (Hash): Required options hash
   * - handler (Function): Function to bind to the button
   *
   *  The options hash accepts two required keys, name and label. The label
   *  value is used as the link's inner text. The name value is set to the
   *  link's class and is used to check the button state.
   *
   *  toolbar.addButton({
   *    name: 'bold', label: "Bold" }, function(editor) {
   *      editor.boldSelection();
   *  });
   *
   *  Would create a link,
   *  "<a href='#' class='button bold'><span>Bold</span></a>"
   **/
  function addButton(options, handler) {
    options = $H(options);

    var label = options.get('label');
    var name = options.get('name') || label.toLowerCase();

    var button = Element('a', {
      'class': 'button', 'href': '#'
    }).update('<span>' + label + '</span>');
    button.addClassName(name);

    var handler = handler || options.get('handler') || function(editor) {
      editor.execCommand(name);
    };
    this.observeButtonClick(button, handler);

    var query = options.get('query') || function(editor) {
      return editor.queryCommandState(name);
    };
    this.observeStateChanges(button, query);

    this.element.appendChild(button);

    return this;
  }

  /**
   * WysiHat.Toolbar#observeButtonClick(element, handler) -> undefined
   * - element (String | Element): Element to bind handler to
   * - handler (Function): Function to bind to the element
   *   fires wysihat:change
   *
   *  In addition to binding the given handler to the element, this observe
   *  function also sets up a few more events. When the elements onclick is
   *  fired, the toolbars hasMouseDown property will be set to true and
   *  back to false on exit.
   **/
  function observeButtonClick(element, handler) {
    var toolbar = this;
    $(element).observe('click', function(event) {
      handler(toolbar.editor);
      toolbar.editor.fire("wysihat:change");
      Event.stop(event);
    });
    return this;
  }

  /**
   * WysiHat.Toolbar#observeStateChanges(element, command) -> undefined
   * - element (String | Element): Element to receive changes
   * - command (String): Name of editor command to observe
   *
   *  Adds the class "selected" to the given Element when the selected text
   *  matches the command.
   *
   *  toolbar.observeStateChanges(buttonElement, 'bold')
   *  would add the class "selected" to the buttonElement when the editor's
   *  selected text was bold.
   **/
  function observeStateChanges(element, handler) {
    var editor = this.editor;

    editor.observe("wysihat:cursormove", function(event) {
      if (handler(editor))
        element.addClassName('selected');
      else
        element.removeClassName('selected');
    });

    return this;
  }

  return {
    initialize:          initialize,
    addButtonSet:        addButtonSet,
    addButton:           addButton,
    observeButtonClick:  observeButtonClick,
    observeStateChanges: observeStateChanges
  };
})());

/** section: wysihat
 * WysiHat.Toolbar.ButtonSets
 *
 * A namespace for various sets of Toolbar buttons. These sets should be
 *  compatible with WysiHat.Toolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);
 **/
WysiHat.Toolbar.ButtonSets = {};

/**
 * WysiHat.Toolbar.ButtonSets.Basic
 *  A basic set of buttons: bold, underline, and italic. This set is
 *  compatible with WysiHat.Toolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);
 **/
WysiHat.Toolbar.ButtonSets.Basic = $A([
  { label: "Bold" },
  { label: "Underline" },
  { label: "Italic" }
]);
