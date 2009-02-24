WysiHat.Events = (function() {
  function forwardEvents(document, editor) {
    Event.observe(document, 'mouseup', function(event) {
      editor.fire("wysihat:mouseup");
    });

    Event.observe(document, 'mousemove', function(event) {
      editor.fire("wysihat:mousemove");
    });

    Event.observe(document, 'keypress', function(event) {
      editor.fire("wysihat:keypress");
    });

    Event.observe(document, 'keyup', function(event) {
      editor.fire("wysihat:keyup");
    });
  }

  function observePasteEvent(window, document, editor) {
    Event.observe(document, 'keydown', function(event) {
      if (event.keyCode == 86)
        editor.fire("wysihat:paste");
    });

    Event.observe(window, 'paste', function(event) {
      editor.fire("wysihat:paste");
    });
  }

  function observeChanges(document, editor) {
    Event.observe(document, 'keypress', function(event) {
      editor.fire("wysihat:change");
    });

    Event.observe(document, 'keyup', function(event) {
      editor.fire("wysihat:change");
    });
  }

  function observeMovements(document, editor) {
    // Fire the cursormove event if selection has changed due to some event
    var handler = function (event) {
      var rg = editor.selection.getRange();
      if (editor.lastRange != rg) {
        editor.fire("wysihat:cursormove");
        editor.lastRange = rg;
      }
    }

    editor.observe("wysihat:change", handler);
    editor.observe("wysihat:mouseup", handler);
    editor.observe("wysihat:mousemove", handler);
  }

  function observeEvents() {
    if (this.observers_setup)
      return;

    var document = this.getDocument();
    var window = this.getWindow();

    forwardEvents(document, this);
    observePasteEvent(window, document, this);
    observeChanges(document, this);
    observeMovements(document, this);

    this.observers_setup = true;
  }

  return {
    observeEvents: observeEvents
  };
})();

WysiHat.Editor.include(WysiHat.Events);
