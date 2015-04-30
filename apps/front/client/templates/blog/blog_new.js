Template.blogNew.created = function() {
  TempImages.remove({});
};

Template.blogNew.destroyed = function() {
  TempImages.remove({});

  $('.cloudinary-uploader input').off('click');
};

function toggleToolbar() {
  if($('#editor').focus()){
    $('.editor-toolbar').css('display', 'block');
  } else {
    $('.editor-toolbar').css('display', 'none');
  }
}

function nextNode(node) {
    if (node.hasChildNodes()) {
        return node.firstChild;
    } else {
        while (node && !node.nextSibling) {
            node = node.parentNode;
        }
        if (!node) {
            return null;
        }
        return node.nextSibling;
    }
}

function getRangeSelectedNodes(range) {
    var node = range.startContainer;
    var endNode = range.endContainer;

    // Special case for a range that is contained within a single node
    if (node == endNode) {
        return [node];
    }

    // Iterate nodes until we hit the end container
    var rangeNodes = [];
    while (node && node != endNode) {
        rangeNodes.push( node = nextNode(node) );
    }

    // Add partially selected nodes at the start of the range
    node = range.startContainer;
    while (node && node != range.commonAncestorContainer) {
        rangeNodes.unshift(node);
        node = node.parentNode;
    }

    return rangeNodes;
}

function getSelectedNodes() {
    if (window.getSelection) {
        var sel = window.getSelection();
        if (!sel.isCollapsed) {
            return getRangeSelectedNodes(sel.getRangeAt(0));
        }
    }
    return [];
}

function mediaSelect() {
  var editor = document.getElementById('editor');
  var childNodes = editor.childNodes;
  if(window.getSelection().focusNode.nodeName == 'FIGURE') {
    $(window.getSelection().focusNode).addClass('is-mediaFocused');
  } else {
    $(childNodes).removeClass('is-mediaFocused');
  }
}

function isSelected() {
  var editor = document.getElementById('editor');
  var focusNode = window.getSelection().focusNode;

  if(editor.hasChildNodes()) {
  var childNodes = editor.childNodes; // This return Array
    if (childNodes && $(focusNode).hasClass('editor-empty')) {
      $(childNodes).removeClass('is-selected');
      $(focusNode).addClass('is-selected');
    } else {
     $(childNodes).removeClass('is-selected');
     $(focusNode.parentNode).addClass('is-selected');
    }
  }
}

function preventBackspace(e) {
  //BackSpace
  var pCount = document.querySelectorAll('#editor p').length || document.querySelectorAll('#editor h3').length || document.querySelectorAll('#editor blockquote').length; 
  // console.log('=======================');
  // console.log('pCount:' + pCount);
  // console.log('textContent:' + document.getElementById('editor').textContent);
  // console.log('textContent.length:' + document.getElementById('editor').textContent.length);
  // console.log('keycode:' + e.keyCode);
  
  if((e.keyCode == 8) && (pCount == 1) && (! document.getElementById('editor').textContent.length)){
    console.log('Prevent Backspace Conditions met');
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

function editorKeyUp(e) {
  // Do something to/when wrap lines of string in editor
  var keyCode = e.keyCode || e.which;
  var focusNode = window.getSelection().focusNode;
  var selectedNode = $.trim($(focusNode).text()).length;

  // Enter
  if(keyCode == 13) {
    // e.preventDefault(); // Does not work in meteor??
    // Set default wrapping to p tag
    document.execCommand('formatBlock', false, 'p'); 
    // pTag = focusedNode. Add .p--p and .p--empty
    var focusNode = window.getSelection().focusNode;
    $(focusNode).addClass('editor-p');
    $(focusNode).addClass('editor-empty');
    $('#editor-header').removeClass('editor-button-active');
  }

  // Removing and Adding of p.class
  if(focusNode && (selectedNode > 0)) {
    //remove .p--empty if p tag has content.
    $(focusNode.parentNode).removeClass('editor-empty');
  } else {
    //add .p--empty if p tag has no content.
    $(focusNode).addClass('editor-empty');
  }

  mediaSelect();
}

function activeButton(focusNode) {
  if($(focusNode).hasClass('editor-align-center') || $(focusNode.parentNode).hasClass('editor-align-center')){
    $('#editor-center').addClass('editor-button-active');
  } else {
    $('#editor-center').removeClass('editor-button-active');
  }
}

//--------------------------------------------------------
//
//  TEMPLATE CALL BACKS FROM HERE
//
//--------------------------------------------------------

Template.blogNew.helpers({
  editable: function() {
    // +Added id="editor"
    return '<div class="editable" contenteditable="false" name="content" id="editor" data-default="true"><p class="editor-p editor-empty">본문</p></div>';
  },
  title: function() {
    return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="false" data-default="true">제목</h2>';
  }
});

Template.blogNew.events({
  'submit #formBlogNew': function(e) {
    e.preventDefault();

    // get inputs
    var object = {
      title: $(e.target).find('[name=title]').html(),
      content: $(e.target).find('[name=content]').html()
    };

    // validate inputs
    /*
    var validation = BlogValidator.validateInsert(object);
    if (! _.isEmpty(validation.errors())) {
      showValidationErrors(e, validation.errors());
      return;
    }
    */

    // method call 'blogInsert'
    Meteor.call('blogInsert', object, function(error, result) {
      if (error) {
        alert(error.reason);
      } else {
        alert('insert success');
        Router.go('myBlogsList');
      }
    });
  },

  'blur #newTitle': function(){
    //var titleInput = document.getElementById('#newTitle');
    var titleLength = $.trim($('#newTitle').text()).length; 
    
    if( titleLength == 0 ){
      $('#newTitle').append('제목');
      $('#newTitle').data('default', true);
    } else {
      $('#newTitle').data('default', false);
    }

    $('#newTitle').attr('contenteditable', false);
  },
  'click #newTitle': function(){
    $('#newTitle').attr('contenteditable', 'true');
    $('#newTitle').focus();

    if( $('#newTitle').data('default') === true ){
      console.log('data-default is TRUE');
      $('#newTitle').empty();
      $('#newTitle').data('default', false);
    } 
    if( $('#newTitle').data('default') === false){
      console.log('data-default is FALSE');
    }
  },

  'blur #editor': function(){
    var contentLength = $.trim($('#editor p').text()).length;
    $('.editor-toolbar').css('display', 'none');

    if( contentLength == 0 ){
      $('#editor p').empty();
      $('#editor p').append('본문');
      $('#editor').data('default', true);
    } else {
      $('#editor').data('default', false);
    }
    $('#editor').attr('contenteditable', 'false');
  },

  'click #editor': function(e){
    $('#editor').attr('contenteditable', 'true');
    $('.editor-toolbar').css('display', 'block');

    if( $('#editor').data('default') === true ){
      // If editor has data-default true, empty editor and focus
      $('#editor p').empty();
      $('#editor').data('default', false);
      // Dirty workaround. Needs focus on editor then editor p for cursor to show
      $('#editor').focus();
      $('#editor p.editor-empty').focus();
    } 
    if( $('#editor').data('default') === false){
      // If editor has data-default false (edited content)
      // Dirty workaround. Needs focus on editor then editor p for cursor to show
      $('#editor').focus();
      $('#editor p').focus();
    }
  },



  /*
  * Editor buttons from here
  */
  'click button#editor-bold': function(e){
    e.preventDefault();
    $('#editor').focus();
    $('#editor').attr('contenteditable', true);
    document.execCommand( 'bold', false );
    $('#editor-bold').toggleClass('editor-button-active');
  },
  'click button#editor-italic': function(e){
    e.preventDefault();
    $('#editor').focus();
    $('#editor').attr('contenteditable', true);
    document.execCommand( 'italic', false );
    $('#editor-italic').toggleClass('editor-button-active');
  },
  'click #editor-header': function(e){
    e.preventDefault();
    
    $('#editor').attr('contenteditable', true);
    var focusNode = window.getSelection().focusNode;

    if(focusNode.parentNode.nodeName == 'H3') {
      $('#editor-header').removeClass('editor-button-active');
      document.execCommand( 'formatBlock', false, 'p' );
      var focusNode = window.getSelection().focusNode; // Needs re-declaring for beneath to work. Figure out why..?
      $(focusNode.parentNode).addClass('editor-p');
      $(focusNode.parentNode).removeClass('editor-h3');
      //console.log('change to p fN:' + focusNode);
      //console.log('change to p fN:' + focusNode.parentNode);
    } else {
      document.execCommand( 'formatBlock', false, 'h3' );
      $('#editor-header').addClass('editor-button-active');
      var focusNode = window.getSelection().focusNode; // Needs re-declaring for beneath to work. Figure out why..?
      $(focusNode.parentNode).addClass('editor-h3');
      $(focusNode.parentNode).removeClass('editor-p');
      //console.log('change to h3 fN:' + focusNode);
      //console.log('change to h3 fN:' + focusNode.parentNode);
    }
  },
  'click #editor-center': function(e){
    e.preventDefault();

    $('#editor').attr('contenteditable', true);
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var focusNode = window.getSelection().focusNode;
    if(getSelectedNodes(range).length > 1 /*&& is 'node'*/){
      if($(getSelectedNodes(range)).hasClass('editor-align-center')){
        $(getSelectedNodes(range)).removeClass('editor-align-center');
      } else {
        $(getSelectedNodes(range)).addClass('editor-align-center');  
      }
    } else {
      if( focusNode.textContent.length == 0 ){
        $(focusNode).toggleClass('editor-align-center');
      } 
      if( focusNode.textContent.length > 1){
        $(focusNode.parentNode).toggleClass('editor-align-center');
      }  
    }        
    activeButton(focusNode);
  },
  // 'click figure.image': function(e){
  //   $(e.target.parentNode).addClass('is-mediaFocused');
  // }
});

Template.blogNew.onRendered(function(){
  var editor = $('#editor');
  //$(editor).focus();
  
  // Mouse Up Events
  $(document).mouseup( function(e){
    setTimeout( function() {
      isSelected();
    }, 1)
  });

  // Mouse Down Events
  $(document).mousedown( function(e) {
    isSelected();
  
  });

  $(editor).on('keydown', function(e){
    preventBackspace(e);
  })

  // Key Up
  $(editor).on('keyup', function(e){
    editorKeyUp(e);
    preventBackspace(e);
    isSelected();
  });

  // Cloudinary Upload Image
  cloudinaryDirectUpload(
    {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      preset: Meteor.settings.public.cloudinary.presets.test,
      progress_bar_selecter: '.progress-wrapper'
    },
    { multiple: true },
    function(e, data) {
      var attributes = {
        // genreId: instance.data.chapter.genreId,
        // bookId: instance.data.chapter.bookId,
        // chapterId: instance.data.chapter._id,
        url: data.result.url,
        surl: data.result.secure_url,
        size: data.result.bytes,
        width: data.result.width,
        height: data.result.height,
        urlFit: data.result.eager[0].url,
        surlFit: data.result.eager[0].secure_url,
        widthFit: data.result.eager[0].width,
        heightFit: data.result.eager[0].height,
        ext: data.result.format,
        mime: data.originalFiles[0].type,
        original: data.originalFiles[0].name,
        repoId: data.result.public_id
      };
    Meteor.call('cImageUploadSave', attributes, function(error, id) {
        if (error) {
          //Alerts.error(error.reason);
          console.log(error.reason)
        }

        attributes._id = id;

        var source = '<p class="image"><img class="img-responsive" src="' + imageUrlFit(attributes) + '" data-id="' + id + '" /></p>';
        
        $('#editor p.is-selected').after(source);

        console.log('upload done');
      });
    }
  );

});