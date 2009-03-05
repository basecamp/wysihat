/*
 *  Fires "mouse:enter" and "mouse:leave" events as a substitute for the
 *  "mouseenter" and "mouseleave" events. Simulates, in effect, the behavior
 *  of the CSS ":hover" pseudoclass.
 */


(function() {
  function respondToMouseOver(event) {
    var target = event.originalTarget;
    // console.log("mouse:enter", "target:", target,
    //   "relatedTarget:", event.relatedTarget);
    if (event.relatedTarget && !event.relatedTarget.descendantOf(target))
      target.fire("mouse:enter", { relatedTarget: event.relatedTarget });
  }
  
  function respondToMouseOut(event) {
    var target = event.originalTarget;
    if (event.relatedTarget && !event.relatedTarget.descendantOf(target))
      target.fire("mouse:leave", { relatedTarget: event.relatedTarget });
  }
    
  
  if (Prototype.Browser.IE) {
    document.observe("mouseenter", function(event) {
      event.element().fire("mouse:enter", { relatedTarget: event.relatedTarget });
    });
    document.observe("mouseleave", function(event) {
      event.element().fire("mouse:leave", { relatedTarget: event.relatedTarget });
    });
  } else {
    document.observe("mouseover", respondToMouseOver);
    document.observe("mouseout",  respondToMouseOut);
  }
  
})();