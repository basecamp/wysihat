WysiHat.iFrame = {
  create: function(textarea, callback) {
    var editArea = new Element('iframe', { 'id': textarea.id + '_editor', 'class': 'editor' });

    Object.extend(editArea, WysiHat.Commands);
    Object.extend(editArea, WysiHat.Persistence);
    Object.extend(editArea, WysiHat.Window);
    Object.extend(editArea, WysiHat.iFrame.Methods);

    editArea.attach(textarea, callback);

    textarea.insert({before: editArea});

    return editArea;
  }
};

WysiHat.iFrame.Methods = {
  attach: function(element, callback) {
    this.textarea = element;

    // Use onload because iframes are not always immediately accessible
    this.observe('load', function() {
      function setDocumentStyles(document, styles) {
        if (Prototype.Browser.IE) {
          var style = document.createStyleSheet();
          style.addRule("body", "border: 0");
          style.addRule("p", "margin: 0");

          $H(styles).each(function(pair) {
            var value = pair.first().underscore().dasherize() + ": " + pair.last();
            style.addRule("body", value);
          });
        } else if (Prototype.Browser.Opera) {
          var style = Element('style').update("p { margin: 0; }");
          var head = document.getElementsByTagName('head')[0];
          head.appendChild(style);
        } else {
          Element.setStyle(document.body, styles);
        }
      }

      try {
        var document = this.getDocument();
      } catch(e) { return; } // No iframe, just stop

      this.selection = new WysiHat.Selection(this);

      // If designMode is still off let this function continue because the
      // iframe may still may be immutable on the first run
      if (this.ready && document.designMode == 'on')
        return;

      setDocumentStyles(document, WysiHat.Editor.styles || {});

      document.designMode = 'on';
      callback(this);
      this.ready = true;
    });
  },

  rawContent: function() {
    var document = this.getDocument();
    return document.body.innerHTML;
  },

  setRawContent: function(text) {
    var document = this.getDocument();
    if (document.body)
      document.body.innerHTML = text;
  }
};
