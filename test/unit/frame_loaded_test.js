new Test.Unit.Runner({
  testFrameLoaded: function() {
    var runner = this;

    frame = new Element('iframe');

    var frameLoaded = false;
    frame.onFrameLoaded(function() { frameLoaded = true; });

    $(document.body).insert(frame);

    runner.wait(1000, function() {
      runner.assert(frameLoaded);
    });
  }
});
