/** section: dom
 *  class Range
 *
 *  This document is work in progress. It implements W3C Range for browsers
 *  that do not support it natively like Internet Explorer. The implementation
 *  is cross-browser compatible but only gets binded if no W3C Range
 *  implementation exists.
 *
 *  Originally created by Jorgen Horstink <mail@jorgenhorstink.nl>
**/

if (typeof Range == 'undefined') {
  Range = function(ownerDocument) {
    this.ownerDocument = ownerDocument;

    this.startContainer = this.ownerDocument.documentElement;
    this.startOffset    = 0;
    this.endContainer   = this.ownerDocument.documentElement;
    this.endOffset      = 0;

    this.collapsed = true;
    this.commonAncestorContainer = this._commonAncestorContainer(this.startContainer, this.endContainer);

    this.detached = false;

    this.START_TO_START = 0;
    this.START_TO_END   = 1;
    this.END_TO_END     = 2;
    this.END_TO_START   = 3;
  }

  Range.CLONE_CONTENTS   = 0;
  Range.DELETE_CONTENTS  = 1;
  Range.EXTRACT_CONTENTS = 2;

  if (!document.createRange) {
    document.createRange = function() {
      return new Range(this);
    };
  }

  Object.extend(Range.prototype, (function() {
    /**
     *  Range#cloneContents() -> DocumentFragment
     *
     *  Duplicates the contents of a Range
    **/
    function cloneContents() {
      return _processContents(this, Range.CLONE_CONTENTS);
    }

    /**
     *  Range#cloneRange() -> Range
     *
     *  Produces a new Range whose boundary-points are equal to the
     *  boundary-points of the Range.
    **/
    function cloneRange() {
      try {
        var clone = new Range(this.ownerDocument);
        // a range solely exists of these properties.
        clone.startContainer          = this.startContainer;
        clone.startOffset             = this.startOffset;
        clone.endContainer            = this.endContainer;
        clone.endOffset               = this.endOffset;
        clone.collapsed               = this.collapsed;
        clone.commonAncestorContainer = this.commonAncestorContainer;
        clone.detached                = this.detached;

        return clone;

      } catch (e) {
        return null;
      };
    }

    /**
     *  Range#collapse(toStart) -> undefined
     *  - toStart (Boolean): If TRUE, collapses the Range onto its start;
     *    if FALSE, collapses it onto its end.
     *
     *  Collapse a Range onto one of its boundary-points
    **/
    function collapse(toStart) {
      if (toStart) {
        this.endContainer = this.startContainer;
        this.endOffset    = this.startOffset;
        this.collapsed    = true;
      } else {
        this.startContainer = this.endContainer;
        this.startOffset    = this.endOffset;
        this.collapsed      = true;
      }
    }

    /**
     *  Range#compareBoundaryPoints(how, sourceRange) -> Integer
     *  - how (Integer): A code representing the type of comparison
     *  - sourceRange (Range): The Range on which this current Range is
     *    compared to.
     *
     *  Compare the boundary-points of two Ranges in a document.
    **/
    function compareBoundaryPoints(compareHow, sourceRange) {
      try {
        var cmnSelf, cmnSource, rootSelf, rootSource;

        // An exception is thrown if the two Ranges have different root containers.
        cmnSelf   = this.commonAncestorContainer;
        cmnSource = sourceRange.commonAncestorContainer;

        rootSelf = cmnSelf;
        while (rootSelf.parentNode) {
          rootSelf = rootSelf.parentNode;
        }

        rootSource = cmnSource;
        while (rootSource.parentNode) {
          rootSource = rootSource.parentNode;
        }

        switch (compareHow) {
          case this.START_TO_START:
            return _compareBoundaryPoints(this, this.startContainer, this.startOffset, sourceRange.startContainer, sourceRange.startOffset);
            break;
          case this.START_TO_END:
            return _compareBoundaryPoints(this, this.startContainer, this.startOffset, sourceRange.endContainer, sourceRange.endOffset);
            break;
          case this.END_TO_END:
            return _compareBoundaryPoints(this, this.endContainer, this.endOffset, sourceRange.endContainer, sourceRange.endOffset);
            break;
          case this.END_TO_START:
            return _compareBoundaryPoints(this, this.endContainer, this.endOffset, sourceRange.startContainer, sourceRange.startOffset);
            break;
        }
      } catch (e) {};

      return null;
    }

    /**
     *  Range#deleteContents() -> undefined
     *
     *  Removes the contents of a Range from the containing document or
     *  document fragment without returning a reference to the
     *  removed content.
    **/
    function deleteContents() {
      try {
        _processContents(this, Range.DELETE_CONTENTS);
      } catch (e) {}
    }

    /**
     *  Range#detach() -> undefined
     *
     *  Called to indicate that the Range is no longer in use and that the
     *  implementation may relinquish any resources associated with
     *  this Range.
    **/
    function detach() {
      this.detached = true;
    }

    /**
     *  Range#extractContents() -> DocumentFragment
     *
     *  Moves the contents of a Range from the containing document or
     *  document fragment to a new DocumentFragment.
    **/
    function extractContents() {
      try {
        return _processContents(this, Range.EXTRACT_CONTENTS);
      } catch (e) {
        return null;
      };
    }

    /**
     *  Range#insertNode(newNode) -> undefined
     *  - newNode (Node): The node to insert at the start of the Range
     *
     *  Inserts a node into the Document or DocumentFragment at the start
     *  of the Range. If the container is a Text node, this will be split at
     *  the start of the Range (as if the Text node's splitText method was
     *  performed at the insertion point) and the insertion will occur
     *  between the two resulting Text nodes. Adjacent Text nodes will not
     *  be automatically merged. If the node to be inserted is a
     *  DocumentFragment node, the children will be inserted rather than the
     *  DocumentFragment node itself.
    **/
    function insertNode(newNode) {
      try {
        var n, newText, offset;

        switch (this.startContainer.nodeType) {
          case Node.CDATA_SECTION_NODE:
          case Node.TEXT_NODE:
            newText = this.startContainer.splitText(this.startOffset);
            this.startContainer.parentNode.insertBefore(newNode, newText);
            break;
          default:
            if (this.startContainer.childNodes.length == 0) {
              offset = null;
            } else {
              offset = this.startContainer.childNodes(this.startOffset);
            }
            this.startContainer.insertBefore(newNode, offset);
        }
      } catch (e) {}
    }

    /**
     *  Range#selectNode(refNode) -> undefined
     *  - refNode (Node): The node to select.
     *
     *  Select a node and its contents
    **/
    function selectNode(refNode) {
      this.setStartBefore(refNode);
      this.setEndAfter(refNode);
    }

    /**
     *  Range#selectNodeContents(refNode) -> undefined
     *  - refNode (Node): Node to select from
     *
     *  Select the contents within a node
    **/
    function selectNodeContents(refNode) {
      this.setStart(refNode, 0);
      this.setEnd(refNode, refNode.childNodes.length);
    }

    /**
     *  Range#setStart(refNode, offset) -> undefined
     *  - refNode (Node): The refNode value. This parameter must be different
     *      from null.
     *  - offset (Integer): The endOffset value.
     *
     *  Sets the attributes describing the end of a Range.
    **/
    function setStart(refNode, offset) {
      try {
        var endRootContainer, startRootContainer;

        this.startContainer = refNode;
        this.startOffset    = offset;

        // If one boundary-point of a Range is set to have a root container
        // other than the current one for the Range, the Range is collapsed to
        // the new position. This enforces the restriction that both boundary-
        // points of a Range must have the same root container.
        endRootContainer = this.endContainer;
        while (endRootContainer.parentNode) {
          endRootContainer = endRootContainer.parentNode;
        }
        startRootContainer = this.startContainer;
        while (startRootContainer.parentNode) {
          startRootContainer = startRootContainer.parentNode;
        }
        if (startRootContainer != endRootContainer) {
          this.collapse(true);
        } else {
          // The start position of a Range is guaranteed to never be after the
          // end position. To enforce this restriction, if the start is set to
          // be at a position after the end, the Range is collapsed to that
          // position.
          if (_compareBoundaryPoints(this, this.startContainer, this.startOffset, this.endContainer, this.endOffset) > 0) {
            this.collapse(true);
          }
        }

        this.collapsed = _isCollapsed(this);

        this.commonAncestorContainer = _commonAncestorContainer(this.startContainer, this.endContainer);
      } catch (e) {}
    }

    /**
     *  Range#setStartAfter(refNode) -> undefined
     *  - refNode (Node): Range ends after refNode.
     *
     *  Sets the end of a Range to be after a node
    **/
    function setStartAfter(refNode) {
      this.setStart(refNode.parentNode, _nodeIndex(refNode) + 1);
    }

    /**
     *  Range#setStartBefore(refNode) -> undefined
     *  - refNode (Node): Range ends before refNode
     *
     *  Sets the end position to be before a node.
    **/
    function setStartBefore(refNode) {
      this.setStart(refNode.parentNode, _nodeIndex(refNode));
    }

    /**
     *  Range#setEnd(refNode, offset) -> undefined
     *  - refNode (Node): The refNode value. This parameter must be different
     *  from null.
     *  - offset (Integer): The startOffset value.
     *
     *  Sets the attributes describing the start of the Range.
    **/
    function setEnd(refNode, offset) {
      try {
        this.endContainer = refNode;
        this.endOffset    = offset;

        // If one boundary-point of a Range is set to have a root container
        // other than the current one for the Range, the Range is collapsed to
        // the new position. This enforces the restriction that both boundary-
        // points of a Range must have the same root container.
        endRootContainer = this.endContainer;
        while (endRootContainer.parentNode) {
          endRootContainer = endRootContainer.parentNode;
        }
        startRootContainer = this.startContainer;
        while (startRootContainer.parentNode) {
          startRootContainer = startRootContainer.parentNode;
        }
        if (startRootContainer != endRootContainer) {
          this.collapse(false);
        } else {
          // ... Similarly, if the end is set to be at a position before the
          // start, the Range is collapsed to that position.
          if (_compareBoundaryPoints(this, this.startContainer, this.startOffset, this.endContainer, this.endOffset) > 0) {
            this.collapse(false);
          }
        }

        this.collapsed = _isCollapsed(this);

        this.commonAncestorContainer = _commonAncestorContainer(this.startContainer, this.endContainer);

      } catch (e) {}
    }

    /**
     *  Range#setEndAfter(refNode) -> undefined
     *  - refNode (Node): Range starts after refNode
     *
     *  Sets the start position to be after a node
    **/
    function setEndAfter(refNode) {
      this.setEnd(refNode.parentNode, _nodeIndex(refNode) + 1);
    }

    /**
     *  Range#setEndBefore(refNode) -> undefined
     *  - refNode (Node): Range starts before refNode
     *
     *  Sets the start position to be before a node
    **/
    function setEndBefore(refNode) {
      this.setEnd(refNode.parentNode, _nodeIndex(refNode));
    }

    /**
     *  Range#surroundContents(newParent) -> undefined
     *  - newParent (Node): The node to surround the contents with.
     *
     *  Reparents the contents of the Range to the given node and inserts the
     *  node at the position of the start of the Range.
    **/
    function surroundContents(newParent) {
      try {
        var n, fragment;

        // empty the newParent
        while (newParent.firstChild) {
          newParent.removeChild(newParent.firstChild);
        }

        fragment = this.extractContents();
        this.insertNode(newParent);
        newParent.appendChild(fragment);
        this.selectNode(newParent);
      } catch (e) {}
    }

    function _compareBoundaryPoints(range, containerA, offsetA, containerB, offsetB) {
      var c, offsetC, n, cmnRoot, childA;
      // In the first case the boundary-points have the same container. A is before B
      // if its offset is less than the offset of B, A is equal to B if its offset is
      // equal to the offset of B, and A is after B if its offset is greater than the
      // offset of B.
      if (containerA == containerB) {
        if (offsetA == offsetB) {
          return 0; // equal
        } else if (offsetA < offsetB) {
          return -1; // before
        } else {
          return 1; // after
        }
      }

      // In the second case a child node C of the container of A is an ancestor
      // container of B. In this case, A is before B if the offset of A is less than or
      // equal to the index of the child node C and A is after B otherwise.
      c = containerB;
      while (c && c.parentNode != containerA) {
        c = c.parentNode;
      }
      if (c) {
        offsetC = 0;
        n = containerA.firstChild;
        while (n != c && offsetC < offsetA) {
          offsetC++;
          n = n.nextSibling;
        }
        if (offsetA <= offsetC) {
          return -1; // before
        } else {
          return 1; // after
        }
      }

      // In the third case a child node C of the container of B is an ancestor container
      // of A. In this case, A is before B if the index of the child node C is less than
      // the offset of B and A is after B otherwise.
      c = containerA;
      while (c && c.parentNode != containerB) {
        c = c.parentNode;
      }
      if (c) {
        offsetC = 0;
        n = containerB.firstChild;
        while (n != c && offsetC < offsetB) {
          offsetC++;
          n = n.nextSibling;
        }
        if (offsetC < offsetB) {
          return -1; // before
        } else {
          return 1; // after
        }
      }

      // In the fourth case, none of three other cases hold: the containers of A and B
      // are siblings or descendants of sibling nodes. In this case, A is before B if
      // the container of A is before the container of B in a pre-order traversal of the
      // Ranges' context tree and A is after B otherwise.
      cmnRoot = range._commonAncestorContainer(containerA, containerB);
      childA = containerA;
      while (childA && childA.parentNode != cmnRoot) {
        childA = childA.parentNode;
      }
      if (!childA) {
        childA = cmnRoot;
      }
      childB = containerB;
      while (childB && childB.parentNode != cmnRoot) {
        childB = childB.parentNode;
      }
      if (!childB) {
        childB = cmnRoot;
      }

      if (childA == childB) {
        return 0; // equal
      }

      n = cmnRoot.firstChild;
      while (n) {
        if (n == childA) {
          return -1; // before
        }
        if (n == childB) {
          return 1; // after
        }
        n = n.nextSibling;
      }

      // can never happen...
      return null;
    }

    function _commonAncestorContainer(containerA, containerB) {
      var parentStart = containerA, parentEnd;
      while (parentStart) {
        parentEnd = containerB;
        while (parentEnd && parentStart != parentEnd) {
          parentEnd = parentEnd.parentNode;
        }
        if (parentStart == parentEnd) {
          break;
        }
        parentStart = parentStart.parentNode;
      }

      if (!parentStart && containerA.ownerDocument) {
        return containerA.ownerDocument.documentElement;
      }

      return parentStart;
    }

    function _isCollapsed(range) {
      return (range.startContainer == range.endContainer && range.startOffset == range.endOffset);
    }

    function _offsetInCharacters(node) {
      switch (node.nodeType) {
        case Node.CDATA_SECTION_NODE:
        case Node.COMMENT_NODE:
        case Node.ELEMENT_NODE:
        case Node.PROCESSING_INSTRUCTION_NODE:
          return true;
        default:
          return false;
      }
    }

    function _processContents(range, action) {
      try {

        var cmnRoot, partialStart = null, partialEnd = null, fragment, n, c, i;
        var leftContents, leftParent, leftContentsParent;
        var rightContents, rightParent, rightContentsParent;
        var next, prev;
        var processStart, processEnd;
        if (range.collapsed) {
          return null;
        }

        cmnRoot = range.commonAncestorContainer;

        if (range.startContainer != cmnRoot) {
          partialStart = range.startContainer;
          while (partialStart.parentNode != cmnRoot) {
            partialStart = partialStart.parentNode;
          }
        }

        if (range.endContainer != cmnRoot) {
          partialEnd = range.endContainer;
          while (partialEnd.parentNode != cmnRoot) {
            partialEnd = partialEnd.parentNode;
          }
        }

        if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
          fragment = range.ownerDocument.createDocumentFragment();
        }

        if (range.startContainer == range.endContainer) {
          switch (range.startContainer.nodeType) {
            case Node.CDATA_SECTION_NODE:
            case Node.COMMENT_NODE:
            case Node.TEXT_NODE:
              if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
                c = range.startContainer.cloneNode();
                c.deleteData(range.endOffset, range.startContainer.data.length - range.endOffset);
                c.deleteData(0, range.startOffset);
                fragment.appendChild(c);
              }
              if (action == Range.EXTRACT_CONTENTS || action == Range.DELETE_CONTENTS) {
                range.startContainer.deleteData(range.startOffset, range.endOffset - range.startOffset);
              }
              break;
            case Node.PROCESSING_INSTRUCTION_NODE:
              //
              break;
            default:
              n = range.startContainer.firstChild;
              for (i = 0; i < range.startOffset; i++) {
                n = n.nextSibling;
              }
              while (n && i < range.endOffset) {
                next = n.nextSibling;
                if (action == Range.EXTRACT_CONTENTS) {
                  fragment.appendChild(n);
                } else if (action == Range.CLONE_CONTENTS) {
                  fragment.appendChild(n.cloneNode());
                } else {
                  range.startContainer.removeChild(n);
                }
                n = next;
                i++;
              }
          }
          range.collapse(true);
          return fragment;
        }


        if (range.startContainer != cmnRoot) {
          switch (range.startContainer.nodeType) {
            case Node.CDATA_SECTION_NODE:
            case Node.COMMENT_NODE:
            case Node.TEXT_NODE:
              if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
                c = range.startContainer.cloneNode(true);
                c.deleteData(0, range.startOffset);
                leftContents = c;
              }
              if (action == Range.EXTRACT_CONTENTS || action == Range.DELETE_CONTENTS) {
                range.startContainer.deleteData(range.startOffset, range.startContainer.data.length - range.startOffset);
              }
              break;
            case Node.PROCESSING_INSTRUCTION_NODE:
              //
              break;
            default:
              if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
                leftContents = range.startContainer.cloneNode(false);
              }
              n = range.startContainer.firstChild;
              for (i = 0; i < range.startOffset; i++) {
                n = n.nextSibling;
              }
              while (n && i < range.endOffset) {
                next = n.nextSibling;
                if (action == Range.EXTRACT_CONTENTS) {
                  fragment.appendChild(n);
                } else if (action == Range.CLONE_CONTENTS) {
                  fragment.appendChild(n.cloneNode());
                } else {
                  range.startContainer.removeChild(n);
                }
                n = next;
                i++;
              }
          }

          leftParent = range.startContainer.parentNode;
          n = range.startContainer.nextSibling;
          for(; leftParent != cmnRoot; leftParent = leftParent.parentNode) {
            if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
              leftContentsParent = leftParent.cloneNode(false);
              leftContentsParent.appendChild(leftContents);
              leftContents = leftContentsParent;
            }

            for (; n; n = next) {
              next = n.nextSibling;
              if (action == Range.EXTRACT_CONTENTS) {
                leftContents.appendChild(n);
              } else if (action == Range.CLONE_CONTENTS) {
                leftContents.appendChild(n.cloneNode(true));
              } else {
                leftParent.removeChild(n);
              }
            }
            n = leftParent.nextSibling;
          }
        }

        if (range.endContainer != cmnRoot) {
          switch (range.endContainer.nodeType) {
            case Node.CDATA_SECTION_NODE:
            case Node.COMMENT_NODE:
            case Node.TEXT_NODE:
              if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
                c = range.endContainer.cloneNode(true);
                c.deleteData(range.endOffset, range.endContainer.data.length - range.endOffset);
                rightContents = c;
              }
              if (action == Range.EXTRACT_CONTENTS || action == Range.DELETE_CONTENTS) {
                range.endContainer.deleteData(0, range.endOffset);
              }
              break;
            case Node.PROCESSING_INSTRUCTION_NODE:
              //
              break;
            default:
              if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
                rightContents = range.endContainer.cloneNode(false);
              }
              n = range.endContainer.firstChild;
              if (n && range.endOffset) {
                for (i = 0; i+1 < range.endOffset; i++) {
                  next = n.nextSibling;
                  if (!next) {
                    break;
                  }
                  n = next;
                }
                for (; n; n = prev) {
                  prev = n.previousSibling;
                  if (action == Range.EXTRACT_CONTENTS) {
                    rightContents.insertBefore(n, rightContents.firstChild);
                  } else if (action == Range.CLONE_CONTENTS) {
                    rightContents.insertBefore(n.cloneNode(True), rightContents.firstChild);
                  } else {
                    range.endContainer.removeChild(n);
                  }
                }
              }
          }

          rightParent = range.endContainer.parentNode;
          n = range.endContainer.previousSibling;
          for(; rightParent != cmnRoot; rightParent = rightParent.parentNode) {
            if (action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) {
              rightContentsParent = rightContents.cloneNode(false);
              rightContentsParent.appendChild(rightContents);
              rightContents = rightContentsParent;
            }

            for (; n; n = prev) {
              prev = n.previousSibling;
              if (action == Range.EXTRACT_CONTENTS) {
                rightContents.insertBefore(n, rightContents.firstChild);
              } else if (action == Range.CLONE_CONTENTS) {
                rightContents.appendChild(n.cloneNode(true), rightContents.firstChild);
              } else {
                rightParent.removeChild(n);
              }
            }
            n = rightParent.previousSibling;
          }
        }

        if (range.startContainer == cmnRoot) {
          processStart = range.startContainer.firstChild;
          for (i = 0; i < range.startOffset; i++) {
            processStart = processStart.nextSibling;
          }
        } else {
          processStart = range.startContainer;
          while (processStart.parentNode != cmnRoot) {
            processStart = processStart.parentNode;
          }
          processStart = processStart.nextSibling;
        }
        if (range.endContainer == cmnRoot) {
          processEnd = range.endContainer.firstChild;
          for (i = 0; i < range.endOffset; i++) {
            processEnd = processEnd.nextSibling;
          }
        } else {
          processEnd = range.endContainer;
          while (processEnd.parentNode != cmnRoot) {
            processEnd = processEnd.parentNode;
          }
        }

        if ((action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) && leftContents) {
          fragment.appendChild(leftContents);
        }

        if (processStart) {
          for (n = processStart; n && n != processEnd; n = next) {
            next = n.nextSibling;
            if (action == Range.EXTRACT_CONTENTS) {
              fragment.appendChild(n);
            } else if (action == Range.CLONE_CONTENTS) {
              fragment.appendChild(n.cloneNode(true));
            } else {
              cmnRoot.removeChild(n);
            }
          }
        }

        if ((action == Range.EXTRACT_CONTENTS || action == Range.CLONE_CONTENTS) && rightContents) {
          fragment.appendChild(rightContents);
        }

        if (action == Range.EXTRACT_CONTENTS || action == Range.DELETE_CONTENTS) {
          if (!partialStart && !partialEnd) {
            range.collapse(true);
          } else if (partialStart) {
            range.startContainer = partialStart.parentNode;
            range.endContainer = partialStart.parentNode;
            range.startOffset = range.endOffset = range._nodeIndex(partialStart) + 1;
          } else if (partialEnd) {
            range.startContainer = partialEnd.parentNode;
            range.endContainer = partialEnd.parentNode;
            range.startOffset = range.endOffset = range._nodeIndex(partialEnd);
          }
        }

        return fragment;

      } catch (e) {
        return null;
      };
    }

    function _nodeIndex(refNode) {
      var nodeIndex = 0;
      while (refNode.previousSibling) {
        nodeIndex++;
        refNode = refNode.previousSibling;
      }
      return nodeIndex;
    }

    return {
      setStart:       setStart,
      setEnd:         setEnd,
      setStartBefore: setStartBefore,
      setStartAfter:  setStartAfter,
      setEndBefore:   setEndBefore,
      setEndAfter:    setEndAfter,

      collapse: collapse,

      selectNode:         selectNode,
      selectNodeContents: selectNodeContents,

      compareBoundaryPoints: compareBoundaryPoints,

      deleteContents:  deleteContents,
      extractContents: extractContents,
      cloneContents:   cloneContents,

      insertNode:       insertNode,
      surroundContents: surroundContents,

      cloneRange: cloneRange,
      toString:   toString,
      detach:     detach,

      _commonAncestorContainer: _commonAncestorContainer
    };
  })());
}

if (!window.getSelection) {
  window.getSelection = function() {
    return Selection.getInstance();
  };

  SelectionImpl = function() {
    this.anchorNode = null;
    this.anchorOffset = 0;
    this.focusNode = null;
    this.focusOffset = 0;
    this.isCollapsed = true;
    this.rangeCount = 0;
    this.ranges = [];
  }

  Object.extend(SelectionImpl.prototype, (function() {
    function addRange(r) {
      return true;
    }

    function collapse() {
      return true;
    }

    function collapseToStart() {
      return true;
    }

    function collapseToEnd() {
      return true;
    }

    function getRangeAt() {
      return true;
    }

    function removeAllRanges() {
      this.anchorNode = null;
      this.anchorOffset = 0;
      this.focusNode = null;
      this.focusOffset = 0;
      this.isCollapsed = true;
      this.rangeCount = 0;
      this.ranges = [];
    }

    function _addRange(r) {
      if (r.startContainer.nodeType != Node.TEXT_NODE) {
        var start = this._getRightStart(r.startContainer);
        var startOffset = 0;
      } else {
        var start = r.startContainer;
        var startOffset = r.startOffset;
      }
      if (r.endContainer.nodeType != Node.TEXT_NODE) {
        var end = this._getRightEnd(r.endContainer);
        var endOffset = end.data.length;
      } else {
        var end = r.endContainer;
        var endOffset = r.endOffset;
      }

      var rStart = this._selectStart(start, startOffset);
      var rEnd   = this._selectEnd(end,endOffset);
      rStart.setEndPoint('EndToStart', rEnd);
      rStart.select();
      document.selection._selectedRange = r;
    }

    function _getRightStart(start, offset) {
      if (start.nodeType != Node.TEXT_NODE) {
        if (start.nodeType == Node.ELEMENT_NODE) {
          start = start.childNodes(offset);
        }
        return getNextTextNode(start);
      } else {
        return null;
      }
    }

    function _getRightEnd(end, offset) {
      if (end.nodeType != Node.TEXT_NODE) {
        if (end.nodeType == Node.ELEMENT_NODE) {
          end = end.childNodes(offset);
        }
        return getPreviousTextNode(end);
      } else {
        return null;
      }
    }

    function _selectStart(start, offset) {
      var r = document.body.createTextRange();
      if (start.nodeType == Node.TEXT_NODE) {
        var moveCharacters = offset, node = start;
        var moveToNode = null, collapse = true;
        while (node.previousSibling) {
          switch (node.previousSibling.nodeType) {
            case Node.ELEMENT_NODE:
              moveToNode = node.previousSibling;
              collapse = false;
              break;
            case Node.TEXT_NODE:
              moveCharacters += node.previousSibling.data.length;
          }
          // if a right candidate is found, we escape the while
          if (moveToNode != null) {
            break;
          }
          node = node.previousSibling;
        }
        // no right candidate is found, so we select the parent node
        // of the start node (which is an Element node always, since
        // start node is a Text node).
        if (moveToNode == null) {
          moveToNode = start.parentNode;
        }

        r.moveToElementText(moveToNode);
        r.collapse(collapse);
        r.move('Character', moveCharacters);
        return r;
      } else {
        return null;
      }
    }

    function _selectEnd(end, offset) {
      var r = document.body.createTextRange(), node = end;
      if (end.nodeType == 3) {
        // text nodes
        var moveCharacters = end.data.length - offset;
        var moveToNode = null, collapse = false;
        while (node.nextSibling) {
          switch (node.nextSibling.nodeType) {
            case Node.ELEMENT_NODE:
              // Right candidate node for moving the Range to is found
              moveToNode = node.nextSibling;
              collapse   = true;
              break;
            case Node.TEXT_NODE:
              moveCharacters += node.nextSibling.data.length;
              break;
          }
          // if a right candidate is found, we escape the while
          if (moveToNode != null) {
            break;
          }
          node = node.nextSibling;
        }
        // no right candidate is found, so we select the parent node
        // of the start node (which is an Element node always, since
        // start node is a Text node).
        if (moveToNode == null) {
          moveToNode = end.parentNode;
          collapse   = false;
        }

        // block level elements have a closing space after collapsing
        switch (moveToNode.nodeName.toLowerCase()) {
          case 'p':
          case 'div':
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
          // need some extension
            moveCharacters++;
        }

        r.moveToElementText(moveToNode);
        r.collapse(collapse);

        r.move('Character', -moveCharacters);
        return r;
      }

      return null;
    }

    function getPreviousTextNode(node) {
      // Loop throught next siblings searching for a suitable textNode
      var stack = [];
      var current = null;
      // Loop through all the next siblings of the incoming Node
      while (node) {
        stack = [];
        current = node;
        // Loop through the stack
        while (current) {
          // Loop up in the tree with the first child
          while (current) {
          // Check if our current node is a suitable text node
          if (current.nodeType == 3 && current.data.replace(/^\s+|\s+$/, '').length) {
            return current;
          }
          // Check if our current node has a previous sibling. If
          // we can't find a suitable textnode in the direct path,
          // we can still use this previous sibling.
          if (current.previousSibling) {
            stack.push (current.previousSibling);
          }
          current = current.lastChild;
        }
        current = stack.pop();
        }
        node = node.previousSibling;
      }
      return null;
    }

    function getNextTextNode(node) {
      // Loop throught next siblings searching for a suitable textNode
      var stack = [];
      var current = null;
      //var sibling = node;
      // Loop through all the next siblings of the incoming Node
      while (node) {
        stack = [];
        current = node;
        // Loop through the stack
        while (current) {
          // Loop up in the tree with the first child
          while (current) {
            // Check if our current node is a suitable text node
            if (current.nodeType == 3 && current.data.replace(/^\s+|\s+$/, '').length) {
                return current;
            }
            // Check if our current node has a next sibling. If
            // we can't find a suitable textnode in the direct path,
            // we can still use this next sibling.
            if (current.nextSibling) {
                stack.push (current.nextSibling);
            }
            current = current.firstChild;
          }
          current = stack.pop();
        }
        node = node.nextSibling;
      }
      return null;
    }

    return {
      // addRange: addRange,
      // collapse: collapse,
      // collapseToStart: collapseToStart,
      // collapseToEnd: collapseToEnd,
      // getRangeAt: getRangeAt,
      removeAllRanges: removeAllRanges,

      _addRange: _addRange,
      _getRightStart: _getRightStart,
      _getRightEnd: _getRightEnd,
      _selectStart: _selectStart,
      _selectEnd: _selectEnd
    };
  })());

  Selection = new function() {
    var instance = null;
    this.getInstance = function() {
      if (instance == null) {
        return (instance = new SelectionImpl());
      } else {
        return instance;
      }
    };
  };
}

Object.extend(Range.prototype, (function() {
  function getNode() {
    var node = this.commonAncestorContainer;

    if (this.startContainer == this.endContainer)
      if (this.startOffset - this.endOffset < 2)
        node = this.startContainer.childNodes[this.startOffset];

    while (node.nodeType == Node.TEXT_NODE)
      node = node.parentNode;

    return node;
  }

  return {
    getNode: getNode
  };
})());
