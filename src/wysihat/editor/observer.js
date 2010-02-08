WysiHat.Observer = Class.create({
  initialize: function(region) {
    $(region).observe("keyup", this.onKeyUp.bind(this));
  },

  onKeyUp: function(event) {
    var element = event.findElement("div.editor");
    if (element) {
      var contents = element.rawContent();
      if (element.previousContents != contents) {
        element.fire("wysihat:change");
        element.previousContents = contents;
      }
    }
  }
});
