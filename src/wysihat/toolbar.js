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

    this.element = new Element('div', { 'class': 'editor_toolbar' });

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
   *   button specifications.
   *
   *  Adds a button set to the toolbar.
   *
   *  WysiHat.Toolbar.ButtonSets.Basic is a built in button set,
   *  that looks like:
   *  [
   *    { label: 'Bold', action: WysiHat.Actions.Bold },
   *    { label: 'Underline', action: WysiHat.Actions.Underline },
   *    { label: 'Italic', action: WysiHat.Actions.Italic }
   *  ]
   **/
  function addButtonSet(set) {
    var toolbar = this;
    $A(set).each(function(buttonSpec){
      toolbar.addButton(buttonSpec);
    });

    return this;
  }

  /**
   * WysiHat.Toolbar#addButton(buttonSpec) -> undefined
   * - buttonSpec (Object): Required object or hash
   *
   *  The buttonSpec must respond to "action", which should be a WysiHat.Action.
   *  It should also have a "label" string property, which is used as the
   *  button link's inner text.
   *
   *  toolbar.addButton({ label: "Bold", action: WysiHat.Actions.Bold });
   *
   *  Would create a link,
   *  "<a href='#' class='button bold'><span>Bold</span></a>"
   **/
  function addButton(buttonSpec) {
    this.editArea.registerAction(buttonSpec.action);
    var button = this.buildButtonElement(buttonSpec);
    this.element.appendChild(button);
    return this;
  }

  /**
   * WysiHat.Toolbar#buildButtonElement(buttonSpec) -> Object
   * - buttonSpec (Object): Required object or hash
   *
   *  Simply generates the HTML element (a link, containing a span for the
   *  label), and sets up the events whereby its action is invoked and its 
   *  display state is updated.
   * 
   *  Override this method in a subclass of WysiHat.Toolbar to build more 
   *  complex buttons and toolbar widgets.
   **/
  function buildButtonElement(buttonSpec) {
    var toolbar = this;

    // create the HTML element
    var btn = Element(
      'a', 
      {"class": "button button" + buttonSpec.label, "href": "#"}
    );
    btn.update('<span>' + buttonSpec.label + '</span>');

    // invoke the action when the button is clicked
    btn.observe(
      'click', 
      function (event) { 
        toolbar.editArea.invokeAction(buttonSpec.action.name);
        Event.stop(event);
      }
    );

    // set or remove the 'selected' class on the element when state changes
    toolbar.editArea.observe(
      'wysihat:state:'+buttonSpec.action.name,
      function (event) {
        if (event.memo.state) {
          btn.addClassName('selected');
        } else {
          btn.removeClassName('selected');
        }
      }
    );

    return btn;
  }

  return {
    initialize:          initialize,
    addButtonSet:        addButtonSet,
    addButton:           addButton,
    buildButtonElement:  buildButtonElement
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

/** section: wysihat
 * WysiHat.Toolbar.ButtonSets.Basic = $A([
 *   { label: 'Bold', action: WysiHat.Actions.Bold },
 *   { label: 'Underline', action: WysiHat.Actions.Underline },
 *   { label: 'Italic', action: WysiHat.Actions.Italic }
 * ]);
 *
 *  A basic set of buttons: bold, underline, and italic.  
 **/
WysiHat.Toolbar.ButtonSets.Basic = $A([
  { label: 'Bold', action: WysiHat.Actions.Bold },
  { label: 'Underline', action: WysiHat.Actions.Underline },
  { label: 'Italic', action: WysiHat.Actions.Italic }
]);
