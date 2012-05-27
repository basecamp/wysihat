(function() {
  function cloneWithAllowedAttributes(element, allowedAttributes) {
    var result = new Element(element.tagName), length = allowedAttributes.length, i;
    element = $(element);

    for (i = 0; i < allowedAttributes.length; i++) {
      attribute = allowedAttributes[i];
      if (element.hasAttribute(attribute)) {
        result.writeAttribute(attribute, element.readAttribute(attribute));
      }
    }

    return result;
  }

  function withEachChildNodeOf(element, callback) {
    var nodes = $A(element.childNodes), length = nodes.length, i;
    for (i = 0; i < length; i++) callback(nodes[i]);
  }

  function sanitizeNode(node, tagsToRemove, tagsToAllow, tagsToSkip) {
    var parentNode = node.parentNode;

    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        var tagName = node.tagName.toLowerCase();

        if (tagsToSkip) {
          var newNode = node.cloneNode(false);
          withEachChildNodeOf(node, function(childNode) {
            newNode.appendChild(childNode);
            sanitizeNode(childNode, tagsToRemove, tagsToAllow, tagsToSkip);
          });
          parentNode.insertBefore(newNode, node);

        } else if (tagName in tagsToAllow) {
          var newNode = cloneWithAllowedAttributes(node, tagsToAllow[tagName]);
          withEachChildNodeOf(node, function(childNode) {
            newNode.appendChild(childNode);
            sanitizeNode(childNode, tagsToRemove, tagsToAllow, tagsToSkip);
          });
          parentNode.insertBefore(newNode, node);

        } else if (!(tagName in tagsToRemove)) {
          withEachChildNodeOf(node, function(childNode) {
            parentNode.insertBefore(childNode, node);
            sanitizeNode(childNode, tagsToRemove, tagsToAllow, tagsToSkip);
          });
        }

      case Node.COMMENT_NODE:
        parentNode.removeChild(node);
    }
  }

  Element.addMethods({
    sanitizeContents: function(element, options) {
      element = $(element);

      var tagsToRemove = {};
      (options.remove || "").split(",").each(function(tagName) {
        tagsToRemove[tagName.strip()] = true;
      });

      var tagsToAllow = {};
      (options.allow || "").split(",").each(function(selector) {
        var parts = selector.strip().split(/[\[\]]/);
        var tagName = parts[0], allowedAttributes = parts.slice(1).grep(/./);
        tagsToAllow[tagName] = allowedAttributes;
      });

      var tagsToSkip = options.skip;

      withEachChildNodeOf(element, function(childNode) {
        sanitizeNode(childNode, tagsToRemove, tagsToAllow, tagsToSkip);
      });

      return element;
    }
  });
})();
