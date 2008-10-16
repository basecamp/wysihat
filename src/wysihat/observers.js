/**
 * class WysiHat.Observers
 *
 *  This needs works
 **/

WysiHat.Observers = {};

WysiHat.Observers.ClassMethods = {
  afterEnableObservers: $A([]),
  afterEnable: function(observer) {
    WysiHat.Observers.ClassMethods.afterEnableObservers.push(observer);
  },

  onChangeObservers: $A([]),
  observeChanges: function(observer) {
    WysiHat.Observers.ClassMethods.onChangeObservers.push(observer);
  },

  onPasteObservers: $A([]),
  observePaste: function(observer) {
    WysiHat.Observers.ClassMethods.onPasteObservers.push(observer);
  }
}

WysiHat.Observers.InstanceMethods = {
  fireAfterEnableObservers: function() {
    var object = this;
    WysiHat.Observers.ClassMethods.afterEnableObservers.each(function(observer) { observer(object); });
  },

  onChangeObservers: $A([]),
  observeChanges: function(observer) {
    this.onChangeObservers.push(observer);
  },

  fireOnChangeObservers: function() {
    var object = this;
    WysiHat.Observers.ClassMethods.onChangeObservers.each(function(observer) { observer(object); });
    this.onChangeObservers.each(function(observer) { observer(object); });
  },

  onPasteObservers: $A([]),
  observePaste: function(observer) {
    this.onPasteObservers.push(observer);
  },

  fireOnPasteObservers: function() {
    var object = this;
    WysiHat.Observers.ClassMethods.onPasteObservers.each(function(observer) { observer(object); });
    this.onPasteObservers.each(function(observer) { observer(object); });
  }
}

Object.extend(WysiHat.Editor, WysiHat.Observers.ClassMethods);
WysiHat.Editor.addMethods(WysiHat.Observers.InstanceMethods);
