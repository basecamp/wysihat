/** section: wysihat
 * WysiHat.Editable
 *  includes WysiHat.Commands, WysiHat.Persistence, WysiHat.Window, WysiHat.Editable.Methods
**/
WysiHat.Editable = {
  create: function(textarea, callback) {
    var editArea = new Element('div', {
      'id': textarea.id + '_editor',
      'class': 'editor',
      'contenteditable': 'true'
    });
    editArea.textarea = textarea;

    WysiHat.Editor.extend(editArea);
    Object.extend(editArea, WysiHat.Editable.Methods);

    callback(editArea);

    textarea.insert({before: editArea});

    return editArea;
  }
};

/** section: wysihat
 *  mixin WysiHat.Editable.Methods
**/
WysiHat.Editable.Methods = {
  getDocument: function() {
    return document;
  },

  getWindow: function() {
    return window;
  },

  rawContent: function() {
    return this.innerHTML;
  },

  setRawContent: function(text) {
    this.innerHTML = text;
  }
};
