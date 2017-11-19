export default {

  isDescendant(parent, child) {
    let node = child.parentNode;

    while (node !== null) {
      if (node === parent) return true;
      node = node.parentNode;
    }

    return false;
  },

  offset(el) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  },

  /**
   * Check if the given node is in an overlay covering the entire window.
   * If the node is the body node, then it can't be an overlay.
   * If the node is part of something with a size the same as the current window,
   * then this is treated as being on an overlay.
   */
  isOnWindowOverlay(node) {
    // short cut everything as the document body can't be an overlay for anything else
    if (node === document.body) return false;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    let toTest = node;

    while (toTest !== null) {
      const nodeSize = toTest.getBoundingClientRect();
      if ((nodeSize.height === windowHeight) && (nodeSize.width === windowWidth)) return true;
      toTest = toTest.parentNode;
      if (toTest === document.body) return false; // we may have back tracked all the way out to the body
    }

    return false;
  },

};
