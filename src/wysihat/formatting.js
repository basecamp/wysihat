WysiHat.Formatting = (function() {
  var ACCUMULATING_LINE      = {};
  var EXPECTING_LIST_ITEM    = {};
  var ACCUMULATING_LIST_ITEM = {};

  return {
    getBrowserMarkupFrom: function(applicationMarkup) {
      var container = new Element("div").update(applicationMarkup);

      function spanify(element, style) {
        element.replace(
          '<span style="' + style +
          '" class="Apple-style-span">' +
          element.innerHTML + '</span>'
        );
      }

      function convertStrongsToSpans() {
        container.select("strong").each(function(element) {
          spanify(element, "font-weight: bold");
        });
      }

      function convertEmsToSpans() {
        container.select("em").each(function(element) {
          spanify(element, "font-style: italic");
        });
      }

      function convertDivsToParagraphs() {
        container.select("div").each(function(element) {
          element.replace("<p>" + element.innerHTML + "</p>");
        });
      }

      if (Prototype.Browser.WebKit || Prototype.Browser.Gecko) {
        convertStrongsToSpans();
        convertEmsToSpans();
      } else if (Prototype.Browser.IE || Prototype.Browser.Opera) {
        convertDivsToParagraphs();
      }

      return container.innerHTML;
    },

    getApplicationMarkupFrom: function(element) {
      var mode = ACCUMULATING_LINE, result, container, line, lineContainer, previousAccumulation;

      function walk(nodes) {
        var length = nodes.length, node, tagName, i;

        for (i = 0; i < length; i++) {
          node = nodes[i];

          if (node.nodeType == Node.ELEMENT_NODE) {
            tagName = node.tagName.toLowerCase();
            open(tagName, node);
            walk(node.childNodes);
            close(tagName);

          } else if (node.nodeType == Node.TEXT_NODE) {
            read(node.nodeValue);
          }
        }
      }

      function open(tagName, node) {
        if (mode == ACCUMULATING_LINE) {
          // if it's a block-level element and the line buffer is full, flush it
          if (isBlockElement(tagName)) {
            if (isEmptyParagraph(node)) {
              accumulate(new Element("br"));
            }

            flush();

            // if it's a ul or ol, switch to expecting-list-item mode
            if (isListElement(tagName)) {
              container = insertList(tagName);
              mode = EXPECTING_LIST_ITEM;
            }

          } else if (isLineBreak(tagName)) {
            // if it's a br, and the previous accumulation was a br,
            // remove the previous accumulation and flush
            if (isLineBreak(getPreviouslyAccumulatedTagName())) {
              previousAccumulation.parentNode.removeChild(previousAccumulation);
              flush();
            }

            // accumulate the br
            accumulate(node.cloneNode(false));

            // if it's the first br in a line, flush
            if (!previousAccumulation.previousNode) flush();

          } else {
            accumulateInlineElement(tagName, node);
          }

        } else if (mode == EXPECTING_LIST_ITEM) {
          if (isListItemElement(tagName)) {
            mode = ACCUMULATING_LIST_ITEM;
          }

        } else if (mode == ACCUMULATING_LIST_ITEM) {
          if (isLineBreak(tagName)) {
            accumulate(node.cloneNode(false));

          } else if (!isBlockElement(tagName)) {
            accumulateInlineElement(tagName, node);
          }
        }
      }

      function close(tagName) {
        if (mode == ACCUMULATING_LINE) {
          if (isLineElement(tagName)) {
            flush();
          }

          if (line != lineContainer) {
            lineContainer = lineContainer.parentNode;
          }

        } else if (mode == EXPECTING_LIST_ITEM) {
          if (isListElement(tagName)) {
            container = result;
            mode = ACCUMULATING_LINE;
          }

        } else if (mode == ACCUMULATING_LIST_ITEM) {
          if (isListItemElement(tagName)) {
            flush();
            mode = EXPECTING_LIST_ITEM;
          }

          if (line != lineContainer) {
            lineContainer = lineContainer.parentNode;
          }
        }
      }

      function isBlockElement(tagName) {
        return isLineElement(tagName) || isListElement(tagName);
      }

      function isLineElement(tagName) {
        return tagName == "p" || tagName == "div";
      }

      function isListElement(tagName) {
        return tagName == "ol" || tagName == "ul";
      }

      function isListItemElement(tagName) {
        return tagName == "li";
      }

      function isLineBreak(tagName) {
        return tagName == "br";
      }

      function isEmptyParagraph(node) {
        return node.tagName.toLowerCase() == "p" && node.childNodes.length == 0;
      }

      function read(value) {
        accumulate(document.createTextNode(value));
      }

      function accumulateInlineElement(tagName, node) {
        var element = node.cloneNode(false);

        if (tagName == "span") {
          if ($(node).getStyle("fontWeight") == "bold") {
            element = new Element("strong");

          } else if ($(node).getStyle("fontStyle") == "italic") {
            element = new Element("em");
          }
        }

        accumulate(element);
        lineContainer = element;
      }

      function accumulate(node) {
        if (mode != EXPECTING_LIST_ITEM) {
          if (!line) line = lineContainer = createLine();
          previousAccumulation = node;
          lineContainer.appendChild(node);
        }
      }

      function getPreviouslyAccumulatedTagName() {
        if (previousAccumulation && previousAccumulation.nodeType == Node.ELEMENT_NODE) {
          return previousAccumulation.tagName.toLowerCase();
        }
      }

      function flush() {
        if (line && line.childNodes.length) {
          container.appendChild(line);
          line = lineContainer = null;
        }
      }

      function createLine() {
        if (mode == ACCUMULATING_LINE) {
          return new Element("div");
        } else if (mode == ACCUMULATING_LIST_ITEM) {
          return new Element("li");
        }
      }

      function insertList(tagName) {
        var list = new Element(tagName);
        result.appendChild(list);
        return list;
      }

      result = container = new Element("div");
      walk(element.childNodes);
      flush();
      return result.innerHTML;
    }
  };
})();
