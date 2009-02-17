new Test.Unit.Runner({
  setup: function() {
    window.ed = window.ed || WysiHat.Editor.attach('content');
  },

  testInvalidActionRegistration: function () { with(this) {
    assertRaise('Error', function () { ed.registerAction({}) });
    assertRaise('Error', function () { ed.registerAction({name: 'xyz'}) });
    assertRaise('Error', function () { ed.registerAction({handler: 'abc'}) });
  }},

  testValidActionRegistration: function () { with (this) {
    assertIdentical(
      ed, 
      ed.registerAction({name: 'xyz', handler: function(){alert('Handled.')}})
    );
  }},

  testActionInvocation: function () { with (this) {
    ed.registerAction({
      name: 'test1', 
      handler: function (editor) { return "passed"; }
    });
    assertEqual("passed", ed.invokeAction('test1'));
  }},

  testMultipleArgumentsToHandler: function () { with (this) {
    ed.registerAction({
      name: 'test2',
      handler: function (editor, arg1, arg2) { return arg1 + arg2; }
    });
    assertEqual(15, ed.invokeAction('test2', 5, 10));
  }},

  testActionQueryHandler: function () { with (this) {
    ed.registerAction({
      name: 'test3',
      handler: function (editor) {},
      query: function (editor) { return true; }
    });
    var state = false;
    ed.observe('wysihat:state:test3', function (e) { state = e.memo.state });
    assert(!state);
    ed.fire('wysihat:cursormove');
    assert(state);
  }},

  testBoldAction: function () { with (this) {
    function selectNode(node) {
      ed.selection.selectNode(node);
      ed.fire('wysihat:cursormove');
    }

    wait(1000, function () {
      ed.registerAction(WysiHat.Actions.Bold);
      var state = false;
      var spans = ed.getDocument().getElementsByTagName('span');
      ed.observe('wysihat:state:bold', function (e) { state = e.memo.state });
      selectNode(spans[0]);
      assert(state);
      selectNode(spans[1]);
      assert(!state);
      ed.invokeAction('bold');
      assert(state);
    });
  }}
});
