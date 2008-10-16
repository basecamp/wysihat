/**
 * class WysiHat.iFrame
 **/
WysiHat.iFrame = Class.create({
  /**
   *  new WysiHat.iFrame(textarea)
   *  - textarea (String | Element): an id or DOM node of the textarea that
   *  you want to convert to rich text.
   *
   *  The iFrame class uses the designMode strategy to implement a
   *  WYSIWYG editor. The given textarea is hidden and a new iframe is
   *  created. The content from the iframe is then saved back to the
   *  textarea.
   **/
  initialize: function(textarea, callback) {
    this.element = new Element('iframe', { 'id': textarea.id + '_editor', 'class': 'editor' });
    this.element.textarea = textarea;

    Object.extend(this.element, WysiHat.AbstractModel.Methods);

    this.element.rawContent = function() {
      return this._document.body.innerHTML;
    }
    this.element.setRawContent = function(text) {
      this._document.body.innerHTML = text;
    }

    var callback = callback;
    var iframe = this.element;

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
        head.appendChild(style).sheet;
      } else {
        Element.setStyle(document.body, styles);
      }
    }

    // Use onload because iframes are not always immediately accessible
    this.element.observe('load', function() {
      try {
        if (this.contentDocument) {
          iframe._document = this.contentDocument;
          iframe._window = this.contentDocument.defaultView;
        } else if (this.contentWindow.document) {
          iframes._document = this.contentWindow.document;
          iframe._window = this.contentWindow;
        }
      } catch(e) { return; } // No iframe, just stop

      // If designMode is still off let this function continue because the
      // iframe may still may be immutable on the first run
      if (iframe.readyState && iframe._document.designMode == 'on')
        return;

      setDocumentStyles(iframe._document, WysiHat.iFrame.styles || {});

      iframe.load();
      iframe._document.designMode = 'on';
      callback(iframe);
      iframe.readyState = true;
    });

    textarea.insert({before: this.element});
  }
});
