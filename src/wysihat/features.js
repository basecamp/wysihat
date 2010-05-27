WysiHat.BrowserFeatures = (function() {
  function createTmpIframe(callback) {
    var frame, frameDocument, frameWindow;

    frame = new Element('iframe');
    frame.setStyle({
      position: 'absolute',
      left: '-1000px'
    });

    frame.on('load', function() {
      frameDocument = frame.contentWindow || frame.contentDocument;
      if (frameDocument.document) frameDocument = frameDocument.document;

      if (frame.contentDocument && frame.contentDocument.defaultView)
        frameWindow = frame.contentDocument.defaultView;
      else if (frame.contentWindow.document)
        frameWindow = frame.contentWindow;

      frameDocument.designMode = 'on';

      callback(frameDocument, frameWindow);

      frame.remove();
    });

    $(document.body).insert(frame);
  }

  var features = {};

  function detectParagraphType(document) {
    document.body.innerHTML = '';
    document.execCommand('insertparagraph', false, null);

    var tagName;
    element = document.body.childNodes[0];
    if (element && element.tagName)
      tagName = element.tagName.toLowerCase();

    if (tagName == 'div')
      features.paragraphType = "div";
    else if (document.body.innerHTML == "<p><br></p>")
      features.paragraphType = "br";
    else
      features.paragraphType = "p";
  }

  function detectIndentType(document) {
    document.body.innerHTML = 'tab';
    document.execCommand('indent', false, null);
    console.log(document.body.innerHTML);

    var tagName;
    element = document.body.childNodes[0];
    if (element && element.tagName)
      tagName = element.tagName.toLowerCase();
    features.indentInsertsBlockquote = (tagName == 'blockquote');
  }

  features.run = function run() {
    if (features.finished) return;

    createTmpIframe(function(document, window) {
      detectParagraphType(document);
      detectIndentType(document);

      features.finished = true;
    });
  }

  return features;
})();
