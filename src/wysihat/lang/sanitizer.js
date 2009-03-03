/** section: lang
 *  class String
**/
Object.extend(String.prototype, {
  /**
   *  String#sanitize([options]) -> String
   *  - options (Hash): Whitelist options
   *
   *  Sanitizes HTML tags and attributes. Options accepts an array of
   *  allowed tags and attributes.
   *
   *  `"<a href='#'>Example</a>".sanitize({
   *      tags: ['a'],
   *      attributes: ['href']
   *   })`
  **/
  sanitize: function(options) {
    return Element("div").update(this).sanitize(options).innerHTML.tidyXHTML();
  }
});

Element.addMethods({
  sanitize: function(element, options) {
    element = $(element);
    options = $H(options);
    var allowed_tags = $A(options.get('tags') || []);
    var allowed_attributes = $A(options.get('attributes') || []);
    var sanitized = Element(element.nodeName);

    $A(element.childNodes).each(function(child) {
      if (child.nodeType == 1) {
        var children = $(child).sanitize(options).childNodes;

        if (allowed_tags.include(child.nodeName.toLowerCase())) {
          var new_child = Element(child.nodeName);
          allowed_attributes.each(function(attribute) {
            if ((value = child.readAttribute(attribute)))
              new_child.writeAttribute(attribute, value);
          });
          sanitized.appendChild(new_child);

          $A(children).each(function(grandchild) { new_child.appendChild(grandchild); });
        } else {
          $A(children).each(function(grandchild) { sanitized.appendChild(grandchild); });
        }
      } else if (child.nodeType == 3) {
        sanitized.appendChild(child);
      }
    });
    return sanitized;
  }
});
