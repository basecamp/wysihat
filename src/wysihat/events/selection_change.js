document.observe("dom:loaded", function() {
  if ('onselectionchange' in document) {
    function selectionChangeHandler() {
      var range   = document.selection.createRange();
      var element = range.parentElement();
      $(element).fire("selection:change");
    }

    document.observe("selectionchange", selectionChangeHandler);
  } else {
    var previousRange;

    function selectionChangeHandler() {
      var element        = document.activeElement;
      var elementTagName = element.tagName.toLowerCase();

      if (elementTagName == "textarea" || elementTagName == "input") {
        previousRange = null;
        $(element).fire("selection:change");
      } else {
        var selection = window.getSelection();
        if (selection.rangeCount < 1) return;

        var range = selection.getRangeAt(0);
        if (range && range.equalRange(previousRange)) return;
        previousRange = range;

        element = range.commonAncestorContainer;
        while (element.nodeType == Node.TEXT_NODE)
          element = element.parentNode;

        $(element).fire("selection:change");
      }
    };

    document.observe("mouseup", selectionChangeHandler);
    document.observe("keyup", selectionChangeHandler);
  }
});
