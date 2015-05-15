inlineEditor =  {
  init : function (editor, editorTitle) {

    var editor = $(editor);
    var editorTitle = $(editorTitle);

    editorEvents.toggleToolbar(editor);

    $(editor).on('click', function (event, editor) {
      console.log('clicked!');
      editorEvents.isSelected(this);
    });

    $(editorTitle).on('blur', function (editorTitle) {
      editorEvents.titleBlur(editorTitle);
    });

    $(editorTitle).on('focus', function (editorTitle) {
      editorEvents.titleFocus(editorTitle);
    });

    $(editor).on('paste', function () {
      editorEvents.handlepaste(document, event);
    });

    $(editorTitle).on('paste', function () {
      editorEvents.handlepaste(document, event);
    });

    $(editor).on('keydown', function (event, editor) {
      editorEvents.preventBackspace(event, this);
    });

    $(editor).on('keyup', function (event, editor) {
      editorEvents.editorKeyUp(event);
      editorEvents.isSelected(this);
      editorEvents.preventBackspace(event, this)
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

  preventBackspace : function (event, editor) {
    var dNode = 'P' || 'H3';

    if( (event.keyCode === 8)                  &&
        (editor.childNodes.length === 1)       &&
        (!editor.textContent.length)           &&
        (editor.firstChild.nodeName === dNode)
      ) {
      console.log('Prevent Backspace Conditions met');
      event.preventDefault();
      event.stopPropagation();
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

  titleBlur : function (title) {
    var titleLength = $.trim($(event.target).text()).length;

    if (titleLength === 0) {
      $(event.target).append('제목');
      $(event.target).data('default', true);
    } else {
      $(event.target).data('default', false);
    }
  },

  titleFocus : function (title) {
    if( $(event.target).data('default') === true ) {
      $(event.target).empty();
      $(event.target).data('default', false);
    }
  }
};
