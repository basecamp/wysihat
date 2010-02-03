/** section: wysihat
 * WysiHat.Editor
**/
WysiHat.Editor = {
  /** section: wysihat
   *  WysiHat.Editor.attach(textarea) -> undefined
   *  - textarea (String | Element): an id or DOM node of the textarea that
   *    you want to convert to rich text.
   *
   *  Creates a new editor for the textarea.
  **/
  attach: function(textarea, options, block) {
    var editArea;

    options = $H(options);
    textarea = $(textarea);
    textarea.hide();

    var id = textarea.id + '_editor';
    if (editArea = $(id))
      return editArea;

    editArea = new Element('div', {
      'id': id,
      'class': 'editor',
      'contentEditable': 'true'
    });
    editArea.textarea = textarea;

    WysiHat.Editor.extend(editArea);

    editArea.selection = new WysiHat.Selection(editArea);

    editArea.load();

    editArea._observeEvents();

    if (block) block(editArea);

    textarea.insert({before: editArea});

    return editArea;
  },

  /** section: wysihat
   *  WysiHat.Editor.include(module) -> Array
   *  - module (Object): an object that will extend each editor element.
   *
   *  Provides extensibility for the editor. Register a module via this method,
   *  and its function properties will be available on any editor instance.
   *
   *  eg:
   *    WysiHat.Editor.include({echo: function(val) { alert(val) }})
   *
   *  This makes the 'echo' function defined in that module available directly
   *  on the editor instance. Consequently (if 'editor' is the result of
   *  a prior call to WysiHat.Editor.attach)...
   *
   *    editor.echo('Hello world!')
   *
   *  ... will show an alert box.
   *
   *  You must register the module via this method *before* the editor
   *  instance is created -- this is not retrospective, and extant editor
   *  instances will be unaffected.
  **/
  include: function(module) {
    this.includedModules = this.includedModules || $A([]);
    this.includedModules.push(module);
  },

  extend: function(object) {
    var modules = this.includedModules || $A([]);
    modules.each(function(module) {
      Object.extend(object, module);
    });
  }
};

//= require "editor/commands"
//= require "editor/events"
//= require "editor/persistence"
