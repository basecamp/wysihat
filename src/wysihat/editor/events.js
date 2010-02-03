/** section: wysihat
 *  mixin WysiHat.Events
 *
 *  Forwards common DOM events to the editor element. All events are
 *  prefixed with 'wysihat:'.
 *
 *  To observe any double clicks in the editor:
 *
 *  var editor = WysiHat.Editor.attach(textarea);
 *  editor.observe('wysihat:dblclick', handler);
 *
 *  The most useful event is the 'wysihat:change' event. It is fired anytime
 *  the text contents of the editor changes. This does not include any mouse
 *  or cursor movements.
 *
 *  In addition to the standard DOM events, 'wysihat:cursormove' is fired
 *  anytime the cursor is moved from any mouse clicks or moved by a key
 *  press. Is also fired when something is typed because the cursor is
 *  still advancing.
**/
WysiHat.Events = (function() {
  var eventsToFoward = [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseover',
    'mousemove',
    'mouseout',
    'keypress',
    'keydown',
    'keyup'
  ];

  function forwardEvents(editor) {
    eventsToFoward.each(function(event) {
      Event.observe(editor, event, function(e) {
        editor.fire('wysihat:' + event);
      });
    });
  }

  function observePasteEvent(editor) {
    Event.observe(editor, 'keydown', function(event) {
      if (event.keyCode == 86)
        editor.fire("wysihat:paste");
    });

    Event.observe(editor, 'paste', function(event) {
      editor.fire("wysihat:paste");
    });
  }

  function observeFocus(editor) {
    Event.observe(editor, 'focus', function(event) {
      editor.fire("wysihat:focus");
    });

    Event.observe(editor, 'blur', function(event) {
      editor.fire("wysihat:blur");
    });
  }

  function observeSelections(editor) {
    Event.observe(document, 'mouseup', function(event) {
      var range = editor.selection.getRange();
      if (!range.collapsed)
        editor.fire("wysihat:select");
    });
  }

  function observeChanges(editor) {
    var previousContents = editor.rawContent();
    Event.observe(document, 'keyup', function(event) {
      var contents = editor.rawContent();
      if (previousContents != contents) {
        editor.fire("wysihat:change");
        previousContents = contents;
      }
    });
  }

  function observeCursorMovements(editor) {
    var previousRange = editor.selection.getRange();
    var handler = function(event) {
      var range = editor.selection.getRange();
      if (previousRange != range) {
        editor.fire("wysihat:cursormove");
        previousRange = range;
      }
    };

    Event.observe(editor, 'keyup', handler);
    Event.observe(editor, 'mouseup', handler);
  }

  function observeEvents() {
    if (this._observers_setup)
      return;

    forwardEvents(this);
    observePasteEvent(this);
    observeFocus(this);
    observeSelections(this);
    observeChanges(this);
    observeCursorMovements(this);

    this._observers_setup = true;
  }

  return {
    _observeEvents: observeEvents
  };
})();

WysiHat.Editor.include(WysiHat.Events);
