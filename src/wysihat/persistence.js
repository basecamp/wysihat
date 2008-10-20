/**
 * mixin WysiHat.Persistence
 *
 *  Methods will be mixed into the editor element. These methods deal with
 *  extracting and filtering content going in and out of the editor.
 */
WysiHat.Persistence = {
  /**
   * WysiHat.Persistence#outputFilter(text) -> String
   *  - text (String): HTML string
   *
   *  Use to filter content coming out of the editor. By default it calls
   *  text.format_html_output. This method has been extract so you can override
   *  it and provide your own custom output filter.
   */
  outputFilter: function(text) {
    return text.format_html_output();
  },

  /**
   * WysiHat.Persistence#inputFilter(text) -> String
   *  - text (String): HTML string
   *
   *  Use to filter content going into the editor. By default it calls
   *  text.format_html_input. This method has been extract so you can override
   *  it and provide your own custom input filter.
   */
  inputFilter: function(text) {
    return text.format_html_input();
  },

  /**
   * WysiHat.Persistence#content() -> String
   *  Returns the editors HTML contents. The contents are first passed
   *  through outputFilter.
   *
   *  You can replace the generic outputFilter with your own function. The
   *  default behavior is to use String#format_html_output.
   *
   *  editor.outputFilter = function(text) {
   *    return MyUtils.format_and_santize(text);
   *  };
   **/
  content: function() {
    return this.outputFilter(this.rawContent());
  },

  /**
   * WysiHat.Persistence#setContent(text) -> undefined
   *  - text (String): HTML string
   *
   *  Replaces editor's entire contents with the given HTML. The contents are
   *  first passed through inputFilter.
   *
   *  You can replace the generic inputFilter with your own function. The
   *  default behavior is to use String#format_html_input.
   *
   *  editor.inputFilter = function(text) {
   *    return MyUtils.format_and_santize(text);
   *  };
   **/
  setContent: function(text) {
    this.setRawContent(this.inputFilter(text));
  },

  /**
   * WysiHat.Persistence#save() -> undefined
   *  Saves editors contents back out to the textarea.
   **/
  save: function() {
    this.textarea.value = this.content();
  },

  /**
   * WysiHat.Persistence#load() -> undefined
   *  Loads textarea contents into editor.
   **/
   load: function() {
     this.setContent(this.textarea.value);
  },

  /**
   * WysiHat.Persistence#reload() -> undefined
   *  Saves current contents and loads contents into editor.
   **/
  reload: function() {
    this.selection.setBookmark();
    this.save();
    this.load();
    this.selection.moveToBookmark();
  }
}
