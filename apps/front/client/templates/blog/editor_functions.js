inlineEditor =  {
  init : function (editor, editorTitle) {

    editorEvents.toggleToolbar(editor);

    // Mouse Up Events
    $(editor).mouseup( function () {
      setTimeout( function() {
        editorEvents.isSelected(this);
      }, 1);
    });

    // Mouse Down Events
    $(editor).mousedown( function () {
      editorEvents.isSelected(this);
    });

    $(editor).on('paste', function () {
      editorEvents.handlepaste(document, event);
    });

    $(editorTitle).on('paste', function () {
      editorEvents.handlepaste(document, event);
    });

    $(editor).on('keyup', function (event, editor) {
      editorEvents.editorKeyUp(event);
      editorEvents.isSelected(this);
      //editorEvents.preventBackspace(event, editor)
    });
  }
};

editorEvents = {
  toggleToolbar : function (editor) {
    if ( $(editor).focus() ) {
      $('.editor-toolbar').css( 'display', 'block' );
    } else {
      $('.editor-toolbar').css( 'display', 'none' );
    }
  },

  // preventBackspace : function (e, editor) {
  //   if( (e.keyCode === 8) && (! this.textContent.length) ){
  //     console.log('Prevent Backspace Conditions met');
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return false;
  //   }
  // },

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

  isSelected : function (editor) {
    var focusNode = window.getSelection().focusNode;
    //var editor = document.getElementById('editor');

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

  handlepaste : function (el, e) {
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
    e.preventDefault();
  },

};
