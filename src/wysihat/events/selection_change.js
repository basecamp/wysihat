(function() {
  if ('onselectionchange' in document) {
    document.attachEvent("onselectionchange", function() {
      var range   = document.selection.createRange();
      var element = range.parentElement();
      $(element).fire("selection:change");
    });
  } else {
    var previousRange;

    var selectionChangeHandler = function() {
      var activeElement = document.activeElement;
      if (activeElement &&
          (activeElement.tagName.toLowerCase() == "textarea" ||
          activeElement.tagName.toLowerCase() == "input")) {
        previousRange = null;
        $(activeElement).fire("selection:change");
      } else {
        var selection = window.getSelection();
        if (selection.rangeCount < 1) return;

        var range = selection.getRangeAt(0);
        if (previousRange == range) return;

        var element = range.commonAncestorContainer;
        while (element.nodeType == Node.TEXT_NODE)
          element = element.parentNode;
        $(element).fire("selection:change");
      }
    };

    document.observe("mouseup", selectionChangeHandler);
    document.observe("keyup", selectionChangeHandler);
  }
})();
