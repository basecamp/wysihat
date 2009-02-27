WysiHat.Events = (function() {
  function forwardEvents(document, editor) {
    Event.observe(document, 'mouseup', function(event) {
      editor.fire("wysihat:mouseup");
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
    Event.observe(document, 'mouseup', function(event) {
      editor.fire("wysihat:change");
    });

    Event.observe(document, 'keyup', function(event) {
      editor.fire("wysihat:change");
    });
  }

  function observeEvents() {
    if (this.observers_setup)
      return;

    var document = this.getDocument();
    var window = this.getWindow();

    forwardEvents(document, this);
    observePasteEvent(window, document, this);
    observeChanges(document, this);

    this.observers_setup = true;
  }

  return {
    observeEvents: observeEvents
  };
})();

WysiHat.Editor.include(WysiHat.Events);
