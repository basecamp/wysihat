/** section: wysihat
 * mixin WysiHat.Persistence
 *
 *  Methods will be mixed into the editor element. These methods deal with
 *  extracting and filtering content going in and out of the editor.
 **/
WysiHat.Persistence = (function() {
  /**
   * WysiHat.Persistence#outputFilter(text) -> String
   * - text (String): HTML string
   *
   *  Use to filter content coming out of the editor. By default it calls
   *  text.formatHTMLOutput. This method has been extract so you can override
   *  it and provide your own custom output filter.
   **/
  function outputFilter(text) {
    return text.formatHTMLOutput();
  }

  /**
   * WysiHat.Persistence#inputFilter(text) -> String
   * - text (String): HTML string
   *
   *  Use to filter content going into the editor. By default it calls
   *  text.formatHTMLInput. This method has been extract so you can override
   *  it and provide your own custom input filter.
   **/
  function inputFilter(text) {
    return text.formatHTMLInput();
  }

  /**
   * WysiHat.Persistence#content() -> String
   *  Returns the editors HTML contents. The contents are first passed
   *  through outputFilter.
   *
   *  You can replace the generic outputFilter with your own function. The
   *  default behavior is to use String#formatHTMLOutput.
   *
   *  editor.outputFilter = function(text) {
   *    return MyUtils.format_and_santize(text);
   *  };
   **/
  function content() {
    return this.outputFilter(this.rawContent());
  }

  /**
   * WysiHat.Persistence#setContent(text) -> undefined
   * - text (String): HTML string
   *
   *  Replaces editor's entire contents with the given HTML. The contents are
   *  first passed through inputFilter.
   *
   *  You can replace the generic inputFilter with your own function. The
   *  default behavior is to use String#formatHTMLInput.
   *
   *  editor.inputFilter = function(text) {
   *    return MyUtils.format_and_santize(text);
   *  };
   **/
  function setContent(text) {
    this.setRawContent(this.inputFilter(text));
  }

  /**
   * WysiHat.Persistence#save() -> undefined
   *  Saves editors contents back out to the textarea.
   **/
  function save() {
    this.textarea.value = this.content();
  }

  /**
   * WysiHat.Persistence#load() -> undefined
   *  Loads textarea contents into editor.
   **/
   function load() {
     this.setContent(this.textarea.value);
  }

  /**
   * WysiHat.Persistence#reload() -> undefined
   *  Saves current contents and loads contents into editor.
   **/
  function reload() {
    this.selection.setBookmark();
    this.save();
    this.load();
    this.selection.moveToBookmark();
  }

  return {
    outputFilter: outputFilter,
    inputFilter:  inputFilter,
    content:      content,
    setContent:   setContent,
    save:         save,
    load:         load,
    reload:       reload
  };
})();

WysiHat.Editor.include(WysiHat.Persistence);
