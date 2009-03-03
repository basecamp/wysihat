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
    options = $H(options);
    textarea = $(textarea);
    textarea.hide();

    var model = options.get('model') || WysiHat.iFrame;
    var initializer = block;

    return model.create(textarea, function(editArea) {
      var document = editArea.getDocument();
      var window = editArea.getWindow();

      editArea.load();

      Event.observe(window, 'focus', function(event) { editArea.focus(); });
      Event.observe(window, 'blur', function(event) { editArea.blur(); });

      editArea._observeEvents();

      // Firefox starts "locked"
      // Insert a character bogus character and undo
      if (Prototype.Browser.Gecko) {
        editArea.execCommand('undo', false, null);
      }

      if (initializer)
        initializer(editArea);

      editArea.focus();
    });
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
//= require "editor/window"
