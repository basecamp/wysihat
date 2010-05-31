(function() {
  function onReadyStateComplete(document, callback) {
    var handler;

    function checkReadyState() {
      if (document.readyState === 'complete') {
        if (handler) handler.stop();
        callback();
        return true;
      } else {
        return false;
      }
    }

    handler = Element.on(document, 'readystatechange', checkReadyState);
    checkReadyState();
  }

  function observeFrameContentLoaded(element) {
    element = $(element);

    var loaded, contentLoadedHandler;

    loaded = false;
    function fireFrameLoaded() {
      if (loaded) return;

      loaded = true;
      if (contentLoadedHandler) contentLoadedHandler.stop();
      element.fire('frame:loaded');
    }

    if (window.addEventListener) {
      contentLoadedHandler = document.on("DOMFrameContentLoaded", function(event) {
        if (element == event.element())
          fireFrameLoaded();
      });
    }

    element.on('load', function() {
      var frameDocument;

      if (typeof frame.contentDocument !== 'undefined') {
        frameDocument = frame.contentDocument;
      } else if (typeof frame.contentWindow !== 'undefined' && typeof frame.contentWindow.document !== 'undefined') {
        frameDocument = frame.contentWindow.document;
      }

      onReadyStateComplete(frameDocument, fireFrameLoaded);
    });

    return element;
  }

  function onFrameLoaded(element, callback) {
    element.on('frame:loaded', callback);
    element.observeFrameContentLoaded();
  }

  Element.addMethods({
    observeFrameContentLoaded: observeFrameContentLoaded,
    onFrameLoaded: onFrameLoaded
  });
})();
