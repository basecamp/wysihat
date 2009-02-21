/** section: wysihat
 * WysiHat.Actions
 *
 *  Actions are the objects that define how users can modify the contents of
 *  the editor. An action has two required properties:
 *
 *  * name - the unique identifier of this action, used for invocation and
 *      in event names for this action.
 *  * handler - the function that modifies the editor. Its first argument is
 *      is the editor, and it can take any number of additional arguments
 *      of any kind.
 *
 *  An action can be any kind of object, so long as it responds to these
 *  properties. You can create a classes, and instantiate them for each
 *  editor on the page. Or you can use a simple hash.
 *
 *  The following optional properties are also recognised for actions:
 *
 *  * query - a function that takes the editor as its argument, and
 *      returns true if this action has been applied to the current
 *      selection. It can also return some positive value other than true, if
 *      the action can have multiple valid states.
 *  * policy - reserved, not yet used.
 *  * shortcut - reserved, not yet used.
 **/
WysiHat.Actions = {}

/** section: wysihat
 * mixin WysiHat.Action.Methods
 *
 * Methods will be mixed into the editor element. These methods allow you
 * to register and invoke commands on the editor.
 **/
WysiHat.Actions.Methods = {
  /**
   * WysiHat.Action.Methods#registerAction(action) -> Object
   * - action (Object): any object that responds to 'name' (String) and
   *     'handler' (Function)
   *
   *  Registers the action with the editor, so that the
   *  editor can iterate over all the actions available to modify its
   *  contents. If the action has a function for its 'query' property,
   *  this is hooked up so that when the cursor moves, the function is
   *  called -- if it returns a different result to previous results,
   *  a "wysihat:state:<actionname>"  event is fired.
   *
   *  For example, if you have a 'bold' action and you move the cursor
   *  _into_ or _out of_ a bolded section of text, the "wysihat:state:bold"
   *  event will fire. If you subscribe to this event, you can look at the
   *  action's state to see how it has changed (this is available as
   *  event.memo.state).
   **/
  registerAction: function (action) {
    // Validate the action -- it should have a name and a handler function.
    if (!Object.isString(action.name)) {
      throw new Error("Action name not a string");
    }
    if (!Object.isFunction(action.handler)) {
      throw new Error("Action handler not a function");
    }

    // A hash, keyed on action names, of actions registered to this editor.
    this.actions = this.actions || $H();

    // A hash, keyed on action name, of the current state of each action,
    // based on the cursor location within the editor.
    this.states = this.states || $H();

    this.actions[action.name] = action;
    this.states[action.name] = null;

    // Subscribe this action's query function to the cursormove event.
    var editor = this;
    if (Object.isFunction(action.query)) {
      editor.observe(
        'wysihat:cursormove',
        function (event) {
          var result = action.query(editor);
          if (result == editor.states[action.name]) { return; }
          editor.states[action.name] = result;
          this.fire(
            "wysihat:state:"+action.name,
            {action: action, state: result}
          );
        }
      );
    }

    return this;
  },

  /**
   * WysiHat.Action.Methods#invokeAction(name[, args]) -> undefined
   * - name (String): the unique name of the action to call
   * - args (undefined): any number of args here will be passed on to handler
   *
   *  Finds the action corresponding to the given name, calls its handler,
   *  and returns the result of the action. The first argument passed to
   *  the handler is the editor object.
   *
   *  If the action handler expects or accepts additional arguments, pass
   *  them in as additional arguments to this function call. For instance,
   *  if you have popped up a custom dialog and received user input, you
   *  can pass it along here.
   *
   *  Note: fires a change event on the editor to process content updates
   *  after the action handler is called.
   **/
  invokeAction: function (name) {
    var result = null;
    if (action = this.actions[name]) {
      data = $A(arguments).clone();
      data.shift();
      data.unshift(this);
      result = action.handler.apply(action, data);
      this.lastRange = null;
      this.fire("wysihat:change");
      this.focus();
    }
    return result;
  }
}

WysiHat.Editor.extension(WysiHat.Actions.Methods);

// A library of built-in actions. In the future, perhaps this could replace
// most of the primitives in commands.js?
WysiHat.Actions.Bold = {
  name: 'bold',
  handler: function (editor) { return editor.boldSelection(); },
  query: function (editor) { return editor.boldSelected(); }
};

WysiHat.Actions.Underline = {
  name: 'underline',
  handler: function (editor) { return editor.underlineSelection(); },
  query: function (editor) { return editor.underlineSelected(); }
};

WysiHat.Actions.Italic = {
  name: 'italic',
  handler: function (editor) { return editor.italicSelection(); },
  query: function (editor) { return editor.italicSelected(); }
};
