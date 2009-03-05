if (typeof PDoc === "undefined") window.PDoc = {};

PDoc.highlightSelected = function(element) {
  if (!element && !window.location.hash) return;
  element = (element || $(window.location.hash.substr(1)));
  if (element) PDoc.highlight(element.up('li, div'));
};

PDoc.highlight = function(element) {
  var self = arguments.callee;
  if (!self.frame) {
    self.frame = new Element('div', { 'class': 'highlighter' });
    document.body.appendChild(self.frame);
  }
  
  var frame = self.frame;
  
  element.getOffsetParent().appendChild(frame);
  
  frame.clonePosition(element, { offsetLeft: -5, offsetTop: -5 });
  var w = parseFloat(element.getStyle('width')),
      h = parseFloat(element.getStyle('height'));
  
  frame.setStyle({
    width:  (w + 10) + 'px',
    height: (h + 10) + 'px'
  });
};

PDoc.HighlightOptions = {
  startcolor: '#e4e4e4',
  restorecolor: true,
  queue: {
    position:'end',
    scope: 'global',
    limit: 1
  }
};

var Filterer = Class.create({
  initialize: function(element, options) {
    this.element = $(element);
    this.options = Object.extend({
      interval: 0.1,
      resultsElement: '.search-results'
    }, options || {});
    
    this.element.writeAttribute("autocomplete", "off");    
    this.element.up('form').observe("submit", Event.stop);
    
    // The Safari-only "search" input type is prettier
    if (Prototype.Browser.WebKit)
      this.element.type = "search";
    
    this.menu = this.options.menu;
    this.links = this.menu.select('a');
    
    this.resultsElement = this.options.resultsElement;
    this.resultsElement.setStyle({
      overflowX: 'hidden'
    });
    
    this.events = {
      filter:   this.filter.bind(this),
      keydown: this.keydown.bind(this)
    };
    
    this.menu.setStyle({ opacity: 0.9 });
    this.addObservers();
    
    this.element.value = '';
  },
  
  addObservers: function() {
    this.element.observe('keyup', this.events.filter);
  },
  
  filter: function(event) {
    if (this._timer) window.clearTimeout(this._timer);
    
    // clear the text box on ESC
    if (event.keyCode && event.keyCode === Event.KEY_ESC) {
      this.element.value = '';
    }
    
    if ([Event.KEY_UP, Event.KEY_DOWN, Event.KEY_RETURN].include(event.keyCode))
      return;
    
    var value = $F(this.element).strip().toLowerCase();    
    if (value === "") {
      this.onEmpty();
      return;
    }
    
    var urls  = this.findURLs(value);  
    this.buildResults(urls);
  },
  
  keydown: function(event) {    
    if (![Event.KEY_UP, Event.KEY_DOWN, Event.KEY_RETURN].include(event.keyCode))
      return;
      
    // ignore if any modifier keys are present
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
      return;
      
    event.stop();
    
    var highlighted = this.resultsElement.down('.highlighted');
    if (event.keyCode === Event.KEY_RETURN) {
      // follow the highlighted item
      if (!highlighted) return;
      window.location.href = highlighted.down('a').href;
    } else {
      var direction = (Event.KEY_DOWN === event.keyCode) ? 1 : -1;
      highlighted = this.moveHighlight(direction);
    }
    
    
    if ([Event.KEY_UP, Event.KEY_DOWN].include(event.keyCode) &&
     !Prototype.Browser.WebKit) {    
      // if up/down key is held down, list should keep scrolling
      // Safari does this automatically because it fires the keydown
      // event over and over
      this._timer = window.setTimeout(this.scrollList.bind(this, direction), 100);
    }
  },
  
  moveHighlight: function(direction) {
    var highlighted = this.resultsElement.down('.highlighted');
    // move the focus
    if (!highlighted) {
      // if there is none, highlight the first result
      var highlighted = this.resultsElement.down('li').addClassName('highlighted');
    } else {
      var method = (direction === 1) ? 'next' : 'previous';
      highlighted.removeClassName('highlighted');
      var adjacent = highlighted[method]('li');
      if (!adjacent) {
        adjacent = method == 'next' ? this.resultsElement.down('li') :
         this.resultsElement.down('li:last-of-type');
      }
      adjacent.addClassName('highlighted');
      highlighted = adjacent;
    }

    // Adjust the scroll offset of the container so that the highlighted
    // item is always in view.
    var distanceToBottom = highlighted.offsetTop + highlighted.offsetHeight;
    if (distanceToBottom > this.resultsElement.offsetHeight + this.resultsElement.scrollTop) {
      // item is too low
      this.resultsElement.scrollTop = distanceToBottom - this.resultsElement.offsetHeight;
    } else if (highlighted.offsetTop < this.resultsElement.scrollTop) {
      // item is too high
      this.resultsElement.scrollTop = highlighted.offsetTop;
    }
    
    return highlighted;
  },
  
  scrollList: function(direction) {
    this.moveHighlight(direction);
    this._timer = window.setTimeout(this.scrollList.bind(this, direction), 100);
  },
  
  buildResults: function(urls) {
    this.resultsElement.update();
    var ul = this.resultsElement;
    urls.each( function(url) {
      var a  = new Element('a', {
        'class': url.type.gsub(/\s/, '_'),
        href:    PDoc.pathPrefix + url.path
      }).update(url.name);
      var li = new Element('li');
      li.appendChild(a);
      ul.appendChild(li);
    });    
    this.showResults();
  },
    
  
  findURLs: function(str) {
    var results = [];
    for (var i in PDoc.elements) {
      if (i.toLowerCase().include(str)) results.push(PDoc.elements[i]);
    }
    return results;
  },
  
  onEmpty: function() {
    this.hideResults();
  },
  
  showResults: function() {
    this.resultsElement.show();
    document.observe("keydown", this.events.keydown);
  },
  
  hideResults: function() {
    this.resultsElement.hide();
    document.stopObserving("keydown", this.events.keydown);
  }  
});

document.observe('dom:loaded', function() {
  new Filterer($('search'), { menu: $('api_menu'), resultsElement: $('search_results') });
});

document.observe('click', function(event) {
  var element = event.findElement('a');
  if (!element) return;
  var href = element.readAttribute('href');
  if (!href.include('#')) return;
  if (element = $(href.split('#').last())) {
    PDoc.highlightSelected(element);
  }
});

document.observe('dom:loaded', function() { PDoc.highlightSelected() });

Event.observe(window, 'load', function() {
  var menu = $('menu');
  var OFFSET = menu.viewportOffset().top;
  
  Event.observe(window, 'scroll', function() {
    var sOffset = document.viewport.getScrollOffsets();
    if (sOffset.top > OFFSET) {
      menu.addClassName('fixed');
    } else menu.removeClassName('fixed');
  })
});