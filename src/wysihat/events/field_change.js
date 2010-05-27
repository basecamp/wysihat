document.on("dom:loaded", function() {
  function fieldChangeHandler(event, element) {
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

  $(document.body).on("keyup", 'input,textarea,*[contenteditable=""],*[contenteditable=true]', fieldChangeHandler);
});
