/** section: wysihat
 * WysiHat.iFrame
 *  includes WysiHat.Commands, WysiHat.Persistence, WysiHat.Window, WysiHat.iFrame.Methods
 **/
WysiHat.iFrame = {
  create: function(textarea, callback) {
    var editArea = new Element('iframe', { 'id': textarea.id + '_editor', 'class': 'editor' });

    Object.extend(editArea, WysiHat.Commands);
    Object.extend(editArea, WysiHat.Persistence);
    Object.extend(editArea, WysiHat.Window);
    Object.extend(editArea, WysiHat.iFrame.Methods);
    Object.extend(editArea, WysiHat.Actions.Methods);

    editArea.attach(textarea, callback);

    textarea.insert({before: editArea});

    return editArea;
  }
};

/** section: wysihat
 * WysiHat.iFrame.Methods
 **/
WysiHat.iFrame.Methods = {
  attach: function(element, callback) {
    this.textarea = element;

    // Use onload because iframes are not always immediately accessible
    this.observe('load', function() {
      try {
        var document = this.getDocument();
      } catch(e) { return; } // No iframe, just stop

      this.selection = new WysiHat.Selection(this);

      // If designMode is still off let this function continue because the
      // iframe may still may be immutable on the first run
      if (this.ready && document.designMode == 'on')
        return;

      this.setStyle({});
      document.designMode = 'on';
      callback(this);
      this.ready = true;
    });
  },

  /**
   * WysiHat.iFrame.Methods#setStyle(styles) -> HTMLElement
   * - styles (Hash): Styles are passed as a hash of property-value pairs in
   *  which the properties are specified in their camelized form.
   *
   *  Sets the style of the body element inside the iFrame. You can use this to
   *  change the font size and family of the editable text. This method also
   *  removes paragraph margins for IE and Opera so it feels you start a new
   *  line when you hit enter, not a new paragraph.
   **/
  setStyle: function(styles) {
    var document = this.getDocument();

    var element = this;
    if (!this.ready)
      return setTimeout(function() { element.setStyle(styles); }, 1);

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

    return this;
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
