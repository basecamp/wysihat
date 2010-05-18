document.observe("dom:loaded", function() {
  function fieldChangeHandler(event) {
    var element = event.findElement('input,textarea,*[contenteditable=""],*[contenteditable=true]');
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
  }

  $(document.body).observe("keyup", fieldChangeHandler);
});
