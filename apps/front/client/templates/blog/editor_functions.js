inlineEditor = {
  toggleToolbar : function (editor) {
    if ( $(editor).focus() ) {
      $('.editor-toolbar').css( 'display', 'block' );
    } else {
      $('.editor-toolbar').css( 'display', 'none' );
    }
  },

  nextNode : function (node) {
    if ( node.hasChildNodes() ) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling) {
          node = node.parentNode;
      }

      if (! node) {
        return null;
      }
      return node.nextSibling;
    }
  },

  getRangeSelectedNodes : function (range) {
      var node = range.startContainer;
      var endNode = range.endContainer;

      // Special case for a range that is contained within a single node
      if (node === endNode) {
        return [node];
      }

      // Iterate nodes until we hit the end container
      var rangeNodes = [];
      while (node && node !== endNode) {
        rangeNodes.push( node = this.nextNode(node) );
      }

      // Add partially selected nodes at the start of the range
      node = range.startContainer;
      while (node && node !== range.commonAncestorContainer) {
        rangeNodes.unshift(node);
        node = node.parentNode;
      }
      return rangeNodes;
  },

  getSelectedNodes : function () {
      if (window.getSelection) {
        var sel = window.getSelection();
        if (!sel.isCollapsed) {
            return this.getRangeSelectedNodes(sel.getRangeAt(0));
        }
      }
      return [];
  },

  preventBackspace : function (e, editor) {
    var editor = document.getElementById('editor');

    //BackSpace
    var pCount = document.querySelectorAll('#editor p').length  ||
                 document.querySelectorAll('#editor h3').length ||
                 document.querySelectorAll('#editor blockquote').length;

    if( (e.keyCode === 8) && (pCount === 1) &&
        (! editor.textContent.length) ){
      console.log('Prevent Backspace Conditions met');
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  },

  editorKeyUp : function (e) {
    // Do something to/when wrap lines of string in editor
    var keyCode = e.keyCode || e.which;
    var focusNode = window.getSelection().focusNode;
    var selectedNode = $.trim( $(focusNode).text() ).length;

    // Enter
    if (keyCode === 13) {
      // Set default wrapping to p tag
      document.execCommand('formatBlock', false, 'p');
      // pTag = focusedNode.
      //$(focusNode).addClass('editor-p');
      //$(focusNode).addClass('editor-empty');
      //$('#editor-header').removeClass('editor-button-active');
    }

    // Removing and Adding of p.class
    if (focusNode && (selectedNode > 0) ) {
      //remove .p--empty if p tag has content.
      $(focusNode.parentNode).removeClass('editor-empty');
    } else {
      //add .p--empty if p tag has no content.
      $(focusNode).addClass('editor-empty');
    }
  },

  isSelected : function () {
    var focusNode = window.getSelection().focusNode;
    var editor = document.getElementById('editor');

    if( $(editor).is(':focus') && editor.hasChildNodes() ) {
      var childNodes = editor.childNodes; // This return Array
      if ( childNodes && $(focusNode).hasClass('editor-empty') ) {
        $(childNodes).removeClass('is-selected');
        $(focusNode).addClass('is-selected');
      } else {
        $(childNodes).removeClass('is-selected');
        $(focusNode.parentNode).addClass('is-selected');
      }
    }
  },

  handlePaste : function ( e ) {
    var paste = e.clipboardData && e.clipboardData.getData ?
        e.clipboardData.getData('text/plain') :                // Standard
        window.clipboardData && window.clipboardData.getData ?
        window.clipboardData.getData('Text') :                 // MS
        false;
    if (paste) {
      console.log(paste);
    }
  }

  // activeButton : function(focusNode) {
  //   if( $(focusNode).hasClass('editor-align-center') ||
  //       $(focusNode.parentNode).hasClass('editor-align-center') ) {
  //     $('#editor-center').addClass('editor-button-active');
  //   } else {
  //     $('#editor-center').removeClass('editor-button-active');
  //   }
  // }

};
