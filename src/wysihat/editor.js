/** section: wysihat
 * WysiHat.Editor
**/
WysiHat.Editor = {
  /** section: wysihat
   *  WysiHat.Editor.attach(textarea) -> undefined
   *  - textarea (String | Element): an id or DOM node of the textarea that
   *    you want to convert to rich text.
   *
   *  Creates a new editor for the textarea.
  **/
  attach: function(textarea) {
    var editArea;

    textarea = $(textarea);

    var id = textarea.id + '_editor';
    if (editArea = $(id)) return editArea;

    editArea = new Element('div', {
      'id': id,
      'class': 'editor',
      'contentEditable': 'true'
    });

    editArea.update(WysiHat.Formatting.getBrowserMarkupFrom(textarea.value));

    Object.extend(editArea, WysiHat.Commands);

    textarea.insert({before: editArea});
    textarea.hide();

    // WysiHat.BrowserFeatures.run()

    return editArea;
  }
};
