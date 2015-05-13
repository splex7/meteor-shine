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

  urlify : function (text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    // return text.replace(urlRegex, function(url) {
    //     return '<a href="' + url + '">' + url + '</a>';
    // })
    // or alternatively
    return text.replace(urlRegex, '<a href="$1">$1</a>')
  },

  // handlepaste : function (elem, e) {
  //   var savedcontent = elem.innerHTML;
  //   if (e && e.clipboardData && e.clipboardData.getData) {// Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
  //     if (/text\/html/.test(e.clipboardData.types)) {
  //         elem.innerHTML = e.clipboardData.getData('text/html');
  //     } else if (/text\/plain/.test(e.clipboardData.types)) {
  //         elem.innerHTML = e.clipboardData.getData('text/plain');
  //     } else {
  //         elem.innerHTML = "";
  //     }
  //     this.waitforpastedata(elem, savedcontent);

  //     if (e.preventDefault) {
  //       e.stopPropagation();
  //       e.preventDefault();
  //     }
  //     return false;
  //   } else {// Everything else - empty editdiv and allow browser to paste content into it, then cleanup
  //     elem.innerHTML = "";
  //     this.waitforpastedata(elem, savedcontent);
  //     return true;
  //   }
  // },
  //
  // // waitforpastedata : function (elem, savedcontent) {
  //     if (elem.childNodes && elem.childNodes.length > 0) {
  //         this.processpaste(elem, savedcontent);
  //     }
  //     else {
  //         that = {
  //             e: elem,
  //             s: savedcontent
  //         }
  //         that.callself = function () {
  //             this.waitforpastedata(that.e, that.s)
  //         }
  //         setTimeout(that.callself,20);
  //     }
  // },

  // processpaste : function (elem, savedcontent) {
  //     pasteddata = elem.innerHTML;
  //     //^^Alternatively loop through dom (elem.childNodes or elem.getElementsByTagName) here

  //     elem.innerHTML = savedcontent;
  //     //var finalPaste = pasteddata.replace(/(<([^>]+)>)/ig, "");

  //     UniHTML.setNewAllowedAttributes(['href'], 'all_elements');

  //     var without = [
  //          'b','i','strong','em','blockquote','ol','ul','li',
  //          'h1','h2','h3','h4','h5','h6','h7',
  //          'p','span','pre','a','u','img','br','table'
  //     ];

  //     var finalPaste = UniHTML.purify(pasteddata, {
  //       withoutTags: without,
  //       noHeaders:   true,
  //       catchErrors: true,
  //     });

  //     //alert(finalPaste);

  //     sel = window.getSelection();

  //     if (sel.getRangeAt && sel.rangeCount) {
  //         range = sel.getRangeAt(0);
  //         range.deleteContents();
  //         range.insertNode( document.createTextNode(finalPaste) );
  //     }
  // }

  handlepaste : function (el, e) {
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
    e.preventDefault();
  },




};
