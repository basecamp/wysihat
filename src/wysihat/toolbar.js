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
   *  - buttonSet (Array): see WysiHat.Toolbar.ButtonSets.Basic for an example
   *  - position (String): before, after, top, or bottom
   *  - container (String | Element): an id or DOM node of the element to
   *     insert the Toolbar into. It is inserted before the editor by default.
   **/
  function initialize(editArea, options) {
    options = $H(options);

    this.editArea = editArea;

    this.hasMouseDown = false;
    this.element = new Element('div', { 'class': 'editor_toolbar' });

    var toolbar = this;
    this.element.observe('mousedown', function(event) {
      toolbar.mouseDown(event);
    });
    this.element.observe('mouseup', function(event) {
      toolbar.mouseUp(event);
    });

    insertToolbar(this, options);

    var buttonSet = options.get('buttonSet');
    if (buttonSet)
      this.addButtonSet(buttonSet);
  }

  function insertToolbar(toolbar, options) {
    var position = options.get('position') || 'before';
    var container = options.get('container') || toolbar.editArea;

    var insertOptions = $H({});
    insertOptions.set(position, toolbar.element);
    $(container).insert(insertOptions.toObject());
  }

  /**
   * WysiHat.Toolbar#addButtonSet(set) -> undefined
   * - set (Array): The set array contains nested arrays that hold the
   *   button options, and handler.
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
    $A(set).each(function(button) {
      var options = button.first();
      var handler = button.last();
      toolbar.addButton(options, handler);
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
    var button = Element('a', { 'class': 'button', 'href': '#' }).update('<span>' + options.get('label') + '</span>');
    button.addClassName(options.get('name'));

    this.observeButtonClick(button, handler);
    this.observeStateChanges(button, options.get('name'));
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
      toolbar.hasMouseDown = true;
      handler(toolbar.editArea);
      toolbar.editArea.fire("wysihat:change");
      Event.stop(event);
      toolbar.hasMouseDown = false;
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
  function observeStateChanges(element, command) {
    fun = function(event) {
      if (event.target.queryCommandState(command))
        element.addClassName('selected');
      else
        element.removeClassName('selected');
    };
    
    this.editArea.observe("wysihat:cursormove", fun);
    return this;
  }

  /**
   * WysiHat.Toolbar#mouseDown(event) -> undefined
   * - event (Event)
   *  This function is triggered when the user clicks their mouse down on
   *  the toolbar element. For now, it only updates the hasMouseDown property
   *  to true.
   **/
  function mouseDown(event) {
    this.hasMouseDown = true;
  }

  /**
   * WysiHat.Toolbar#mouseDown(event) -> undefined
   * - event (Event)
   *  This function is triggered when the user releases their mouse from
   *  the toolbar element. It resets the hasMouseDown property back to false
   *  and refocuses on the editing window.
   **/
  function mouseUp(event) {
    // refocus the editing area
    this.editArea.focus();
    this.hasMouseDown = false;
  }

  return {
    initialize:          initialize,
    addButtonSet:        addButtonSet,
    addButton:           addButton,
    observeButtonClick:  observeButtonClick,
    observeStateChanges: observeStateChanges,
    mouseDown:           mouseDown,
    mouseUp:             mouseUp
  };
})());

WysiHat.Toolbar.ButtonSets = {};

/** section: wysihat
 * WysiHat.Toolbar.ButtonSets.Basic = $A([
 *    [{ name: 'bold', label: "Bold" }, function(editor) {
 *      editor.boldSelection();
 *    }],
 *
 *    [{ name: 'underline', label: "Underline" }, function(editor) {
 *      editor.underlineSelection();
 *    }],
 *
 *    [{ name: 'italic', label: "Italic" }, function(editor) {
 *      editor.italicSelection();
 *    }]
 *  ])
 *
 *  A basic set of buttons: bold, underline, and italic. This set is
 *  compatible with WysiHat.Toolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.Toolbar.ButtonSets.Basic);
 **/
WysiHat.Toolbar.ButtonSets.Basic = $A([
  [{ name: 'bold', label: "Bold" }, function(editor) {
    editor.boldSelection();
  }],

  [{ name: 'underline', label: "Underline" }, function(editor) {
    editor.underlineSelection();
  }],

  [{ name: 'italic', label: "Italic" }, function(editor) {
    editor.italicSelection();
  }]
]);
