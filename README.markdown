WysiHat
=======

#### A WYSIWYG JavaScript framework

WysiHat is a WYSIWYG JavaScript framework that provides an extensible
foundation to design your own rich text editor. WysiHat stays out of your
way and leaves the UI design to you.

### Support platforms

WysiHat currently supports:

* Microsoft Internet Explorer for Windows, version 6.0 and higher
* Mozilla Firefox 2.0 and higher
* Apple Safari 3.0 and higher
* Opera 9.52 and higher
* Google Chrome

### Dependencies

* Prototype 1.6 or later (http://prototypejs.org/)

## Documentation

Code is documented inline with PDoc (http://pdoc.org/).

The generated HTML documentation can be found on the `gh-pages` branch or viewed online at (http://josh.github.com/wysihat/).

### Examples

Several examples can be found under `examples/` to get you started.

### Downloading

Tagged releases will be posted on the GitHub downloads section (http://github.com/josh/wysihat/downloads).

### Building from source

You can build the latest version of WysiHat from source by running
`rake` the root directory. The generated file will be saved to
`dist/wysihat.js`. Ruby and the Rake gem are only required to build
the project from source. It is not required to run the code.

## Contributing

Check out the WysiHat source with

    $ git clone git://github.com/josh/wysihat.git
    $ cd wysihat
    $ git submodule init
    $ git submodule update

GitHub pull requests are welcome.

## License

WysiHat is released under the MIT license.
