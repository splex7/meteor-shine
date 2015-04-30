Template.blogOne.created = function() {
  TempImages.remove({});
};

Template.blogOne.destroyed = function() {
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



Template.blogOne.helpers({
	editable: function() {
	var content = this.blog.content;
	return '<div class="editable" contenteditable="false" name="content" id="editor" data-default="false">'+ content +'</div>';
	},
	title: function() {
	var title = this.blog.title;
	return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="false" data-default="false">' + title + '</h2>';
	},
	ownPost: function() {
	return this.blog.user._id === Meteor.userId();
	}
});

Template.blogOne.events({
	'submit #formBlogEdit': function(e) {
    e.preventDefault();

    // get inputs
    var blogId = this.blog._id;
    var object = {
      title: $(e.target).find('[name=title]').html(),
      content: $(e.target).find('[name=content]').html()
    };

    // validate inputs
    var validation = BlogValidator.validateUpdate(object);
    if (! _.isEmpty(validation.errors())) {
      showValidationErrors(e, validation.errors());
      return;
    }

    // method call 'blogUpdate'
    Meteor.call('blogUpdate', blogId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        if (result !== 1) {
          alert('update fails');
        } else {
          Alerts.notify('success', 'Blog updated successfully.');
          //Router.go('myBlogsList');
          /*
          Alerts.dialog('alert', 'Blog update succeeded', function() {
            Router.go('myBlogsList');
          });
          */
        }
      }
    });

  },

	'blur #newTitle': function(){
		if(this.blog.user._id === Meteor.userId()){
			var titleLength = $.trim($('#newTitle').text()).length; 

			if( titleLength == 0 ){
				$('#newTitle').append('제목');
				$('#newTitle').data('default', true);
			} else {
				$('#newTitle').data('default', false);
			}

			$('#newTitle').attr('contenteditable', false);
		}
	},
	'click #newTitle': function(){
		if(this.blog.user._id === Meteor.userId()){
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
		}
	},

	'blur #editor': function(){
		if(this.blog.user._id === Meteor.userId()){	
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
		}
	},

	'click #editor': function(e){
		if(this.blog.user._id === Meteor.userId()){
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
		}
	},
})

Template.blogOne.onRendered(function(){
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