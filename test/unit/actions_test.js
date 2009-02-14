new Test.Unit.Runner({
  setup: function() {
    runner = this;
    ed = typeof(ed) == 'object' ? ed : WysiHat.Editor.attach('content');
  },

  testInvalidActionRegistration: function () {
    runner.assertRaise(
      'Error',
      function () { ed.registerAction({}) }
    );
    runner.assertRaise(
      'Error',
      function () { ed.registerAction({name: 'xyz'}) }
    );
    runner.assertRaise(
      'Error',
      function () { ed.registerAction({handler: 'abc'}) }
    );
  },

  testValidActionRegistration: function () {
    runner.assertIdentical(
      ed, 
      ed.registerAction({name: 'xyz', handler: function(){alert('Handled.')}})
    );
  },

  testActionInvocation: function () {
    ed.registerAction({
      name: 'test1', 
      handler: function (editor) { return "passed"; }
    });
    runner.assertEqual("passed", ed.invokeAction('test1'));
  },

  testMultipleArgumentsToHandler: function () {
    ed.registerAction({
      name: 'test2',
      handler: function (editor, arg1, arg2) { return arg1 + arg2; }
    });
    runner.assertEqual(15, ed.invokeAction('test2', 5, 10));
  },

  testActionQueryHandler: function () {
    ed.registerAction({
      name: 'test3',
      handler: function (editor) {},
      query: function (editor) { return true; }
    });
    var pass = false;
    ed.observe('wysihat:state:test3', function (e) { pass = e.memo.state });
    runner.assert(!pass);
    ed.fire('wysihat:cursormove');
    runner.assert(pass);
  },

  /* This test FAILS because it runs before the iframe 'load' event is
   * fired. Is there a way to delay the Runner? */
  testBoldAction: function () {
    ed.registerAction(WysiHat.Actions.Bold);
    var state = false;
    ed.observe('wysihat:state:bold', function (e) { state = e.memo.state });
    ed.selection.selectNode(ed.down('strong'));
    runner.assert(state);
    ed.selection.selectNode(ed.down('em'));
    runner.assert(!state);
    ed.invokeAction('bold');
    runner.assert(state);
  }
});
