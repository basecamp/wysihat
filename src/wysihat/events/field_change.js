document.observe("dom:loaded", function() {
  $(document.body).observe("keyup", function(event) {
    var element = event.findElement("input,textarea,[contenteditable=true]");
    if (element) {
      var value;

      if (element.contentEditable == 'true')
        value = element.innerHTML;
      else if (element.getValue)
        value = element.getValue();

      if (value && element.previousValue != value) {
        element.fire("field:change");
        element.previousValue = value;
      }
    }
  });
});
