WysiHat.AbstractModel = {}

WysiHat.AbstractModel.Methods = {
  getSelection: function() {
    return new WysiHat.Selection(this._document, this._window);
  },

  outputFilter: function(text) {
    return text.format_html_output();
  },

  inputFilter: function(text) {
    return text.format_html_input();
  },

  /**
   * WysiHat.AbstractModel#content() -> String
   *  Returns the editors HTML contents. The contents are first passed
   *  through outputFilter.
   *
   *  You can replace the generic outputFilter with your own function. The
   *  default behavior is to use String#format_html_output.
   *
   *  editor.model.outputFilter = function(text) {
   *    return MyUtils.format_and_santize(text);
   *  };
   **/
  content: function() {
    return this.outputFilter(this.rawContent());
  },

  /**
   * WysiHat.AbstractModel#setContent(text) -> undefined
   * - text (String): HTML string
   *  Replaces editor's entire contents with the given HTML. The contents are
   *  first passed through inputFilter.
   *
   *  You can replace the generic inputFilter with your own function. The
   *  default behavior is to use String#format_html_input.
   *
   *  editor.model.inputFilter = function(text) {
   *    return MyUtils.format_and_santize(text);
   *  };
   **/
  setContent: function(text) {
    this.setRawContent(this.inputFilter(text));
  },

  /**
   * WysiHat.AbstractModel#save() -> undefined
   * Saves editors contents back out to the textarea.
   **/
  save: function() {
    this.textarea.value = this.content();
  },

  /**
   * WysiHat.AbstractModel#load() -> undefined
   * Loads textarea contents into editor.
   **/
   load: function() {
     this.setContent(this.textarea.value);
  },

  /**
   * WysiHat.AbstractModel#reload() -> undefined
   * Saves current contents and loads contents into editor.
   **/
  reload: function() {
    this.getSelection().setBookmark();
    this.save();
    this.load();
    this.getSelection().moveToBookmark();
  }
}
