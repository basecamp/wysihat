//= require "./events/selection_change"

/** section: wysihat
 *  class WysiHat.Toolbar
**/
WysiHat.Toolbar = Class.create((function() {
  /**
   *  new WysiHat.Toolbar(editor)
   *  - editor (WysiHat.Editor): the editor object that you want to attach to
   *
   *  Creates a toolbar element above the editor. The WysiHat.Toolbar object
   *  has many helper methods to easily add buttons to the toolbar.
   *
   *  This toolbar class is not required for the Editor object to function.
   *  It is merely a set of helper methods to get you started and to build
   *  on top of. If you are going to use this class in your application,
   *  it is highly recommended that you subclass it and override methods
   *  to add custom functionality.
  **/
  function initialize(editor) {
    this.editor = editor;
    this.element = this.createToolbarElement();
  }

  /**
   *  WysiHat.Toolbar#createToolbarElement() -> Element
   *
   *  Creates a toolbar container element and inserts it right above the
   *  original textarea element. The element is a div with the class
   *  'editor_toolbar'.
   *
   *  You can override this method to customize the element attributes and
   *  insert position. Be sure to return the element after it has been
   *  inserted.
  **/
  function createToolbarElement() {
    var toolbar = new Element('div', { 'class': 'editor_toolbar' });
    this.editor.insert({before: toolbar});
    return toolbar;
  }

  /**
   *  WysiHat.Toolbar#addButtonSet(set) -> undefined
   *  - set (Array): The set array contains nested arrays that hold the
   *  button options, and handler.
   *
   *  Adds a button set to the toolbar.
  **/
  function addButtonSet(set) {
    $A(set).each(function(button){
      this.addButton(button);
    }.bind(this));
  }

  /**
   *  WysiHat.Toolbar#addButton(options[, handler]) -> undefined
   *  - options (Hash): Required options hash
   *  - handler (Function): Function to bind to the button
   *
   *  The options hash accepts two required keys, name and label. The label
   *  value is used as the link's inner text. The name value is set to the
   *  link's class and is used to check the button state. However the name
   *  may be omitted if the name and label are the same. In that case, the
   *  label will be down cased to make the name value. So a "Bold" label
   *  will default to "bold" name.
   *
   *  The second optional handler argument will be used if no handler
   *  function is supplied in the options hash.
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

    if (!options.get('name'))
      options.set('name', options.get('label').toLowerCase());
    var name = options.get('name');

    var button = this.createButtonElement(this.element, options);

    var handler = this.buttonHandler(name, options);
    this.observeButtonClick(button, handler);

    var handler = this.buttonStateHandler(name, options);
    this.observeStateChanges(button, name, handler);
  }

  /**
   *  WysiHat.Toolbar#createButtonElement(toolbar, options) -> Element
   *  - toolbar (Element): Toolbar element created by createToolbarElement
   *  - options (Hash): Options hash that pass from addButton
   *
   *  Creates individual button elements and inserts them into the toolbar
   *  container. The default elements are 'a' tags with a 'button' class.
   *
   *  You can override this method to customize the element attributes and
   *  insert positions. Be sure to return the element after it has been
   *  inserted.
  **/
  function createButtonElement(toolbar, options) {
    var button = new Element('a', {
      'class': 'button', 'href': '#'
    });
    button.update('<span>' + options.get('label') + '</span>');
    button.addClassName(options.get('name'));

    toolbar.appendChild(button);

    return button;
  }

  /**
   *  WysiHat.Toolbar#buttonHandler(name, options) -> Function
   *  - name (String): Name of button command: 'bold', 'italic'
   *  - options (Hash): Options hash that pass from addButton
   *
   *  Returns the button handler function to bind to the buttons onclick
   *  event. It checks the options for a 'handler' attribute otherwise it
   *  defaults to a function that calls execCommand with the button name.
  **/
  function buttonHandler(name, options) {
    if (options.handler)
      return options.handler;
    else if (options.get('handler'))
      return options.get('handler');
    else
      return function(editor) { editor.execCommand(name); };
  }

  /**
   *  WysiHat.Toolbar#observeButtonClick(element, handler) -> undefined
   *  - element (Element): Button element
   *  - handler (Function): Handler function to bind to element
   *
   *  Bind handler to elements onclick event.
  **/
  function observeButtonClick(element, handler) {
    element.on('click', function(event) {
      handler(this.editor);
      event.stop();
    }.bind(this));
  }

  /**
   *  WysiHat.Toolbar#buttonStateHandler(name, options) -> Function
   *  - name (String): Name of button command: 'bold', 'italic'
   *  - options (Hash): Options hash that pass from addButton
   *
   *  Returns the button handler function that checks whether the button
   *  state is on (true) or off (false). It checks the options for a
   *  'query' attribute otherwise it defaults to a function that calls
   *  queryCommandState with the button name.
  **/
  function buttonStateHandler(name, options) {
    if (options.query)
      return options.query;
    else if (options.get('query'))
      return options.get('query');
    else
      return function(editor) { return editor.queryCommandState(name); };
  }

  /**
   *  WysiHat.Toolbar#observeStateChanges(element, name, handler) -> undefined
   *  - element (Element): Button element
   *  - name (String): Button name
   *  - handler (Function): State query function
   *
   *  Determines buttons state by calling the query handler function then
   *  calls updateButtonState.
  **/
  function observeStateChanges(element, name, handler) {
    var previousState;
    this.editor.on("selection:change", function(event) {
      var state = handler(this.editor);
      if (state != previousState) {
        previousState = state;
        this.updateButtonState(element, name, state);
      }
    }.bind(this));
  }

  /**
   *  WysiHat.Toolbar#updateButtonState(element, name, state) -> undefined
   *  - element (Element): Button element
   *  - name (String): Button name
   *  - state (Boolean): Whether button state is on/off
   *
   *  If the state is on, it adds a 'selected' class to the button element.
   *  Otherwise it removes the 'selected' class.
   *
   *  You can override this method to change the class name or styles
   *  applied to buttons when their state changes.
  **/
  function updateButtonState(element, name, state) {
    if (state)
      element.addClassName('selected');
    else
      element.removeClassName('selected');
  }

  return {
    initialize:           initialize,
    createToolbarElement: createToolbarElement,
    addButtonSet:         addButtonSet,
    addButton:            addButton,
    createButtonElement:  createButtonElement,
    buttonHandler:        buttonHandler,
    observeButtonClick:   observeButtonClick,
    buttonStateHandler:   buttonStateHandler,
    observeStateChanges:  observeStateChanges,
    updateButtonState:    updateButtonState
  };
})());

/**
 * WysiHat.Toolbar.ButtonSets
 *
 *  A namespace for various sets of Toolbar buttons. These sets should be
 *  compatible with WysiHat.Toolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);
**/
WysiHat.Toolbar.ButtonSets = {};

/**
 * WysiHat.Toolbar.ButtonSets.Basic
 *
 *  A basic set of buttons: bold, underline, and italic. This set is
 *  compatible with WysiHat.Toolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);
**/
WysiHat.Toolbar.ButtonSets.Basic = $A([
  { label: "Bold" },
  { label: "Underline" },
  { label: "Italic" }
]);
