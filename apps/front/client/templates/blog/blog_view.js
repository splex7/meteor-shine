Template.blogOne.created = function() {
  TempImages.remove({});
};

Template.blogOne.destroyed = function() {
  TempImages.remove({});

  $('.cloudinary-uploader input').off('click');
};

Template.blogOne.helpers({
	editable: function() {
	var content = this.blog.content;
	return '<div class="editable" id="editor" contenteditable="false" name="content" data-default="false">'+ content +'</div>';
	},
	title: function() {
	var title = this.blog.title;
	return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="false" data-default="false">' + title + '</h2>';
	},
	ownPost: function() {
	return this.blog.user._id === Meteor.userId();
	},
  editMode: function() {
    return Session.get('editMode') == true;
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
          Session.set('editMode', false);

          $('#newTitle').attr('contenteditable', 'false');
          $('#editor').attr('contenteditable', 'false');
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

  'click #cancelEdit': function(){
    Session.set('editMode', false);

    var content = this.blog.content;
    var title = this.blog.title;

    $('#editor').empty().append(content);
    $('#newTitle').empty().append(title);

    $('#newTitle').attr('contenteditable', 'false');
    $('#editor').attr('contenteditable', 'false');
  },

	'blur #newTitle': function(){
		if(this.blog.user._id === Meteor.userId()){
			var titleLength = $.trim($('#newTitle').text()).length;
      //Session.set('editMode', false);

			if( titleLength == 0 ){
				$('#newTitle').append('제목');
				$('#newTitle').data('default', true);
			} else {
				$('#newTitle').data('default', false);
			}

			//$('#newTitle').attr('contenteditable', false);
		}
	},

	'click #newTitle': function(){
		if(this.blog.user._id === Meteor.userId()){
			//$('#newTitle').attr('contenteditable', 'true');
			$('#newTitle').focus();
      //Session.set('editMode', true);

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

	// 'blur #editor': function(){
	// 	if(this.blog.user._id === Meteor.userId()){
	// 		var contentLength = $.trim($('#editor p').text()).length;
	// 		$('.editor-toolbar').css('display', 'none');
 //      Session.set('editMode', false);

	// 		if( contentLength == 0 ){
	// 			$('#editor p').empty();
	// 			$('#editor p').append('본문');
	// 			$('#editor').data('default', true);
	// 		} else {
	// 			$('#editor').data('default', false);
	// 		}
	// 		$('#editor').attr('contenteditable', 'false');
	// 	}
	// },

	// 'click #editor': function(e){
	// 	if(this.blog.user._id === Meteor.userId()){
	// 		$('#editor').attr('contenteditable', 'true');
	// 		$('.editor-toolbar').css('display', 'block');
 //      Session.set('editMode', true);

	// 		if( $('#editor').data('default') === true ){
	// 			// If editor has data-default true, empty editor and focus
	// 			$('#editor p').empty();
	// 			$('#editor').data('default', false);
	// 			// Dirty workaround. Needs focus on editor then editor p for cursor to show
	// 			$('#editor').focus();
	// 			$('#editor p.editor-empty').focus();
	// 		}
	// 		if( $('#editor').data('default') === false){
	// 			// If editor has data-default false (edited content)
	// 			// Dirty workaround. Needs focus on editor then editor p for cursor to show
	// 			$('#editor').focus();
	// 			$('#editor p').focus();
	// 		}
	// 	}
	// },
  'click #edit': function(){
    Session.set('editMode', true);
    $('#editor').attr('contenteditable', 'true');
    $('#newTitle').attr('contenteditable', 'true');
  }
})

Template.blogOne.onRendered(function(){


	var editor = $('#editor');

  Session.set('editMode', false);

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

      preset: Meteor.settings.public.cloudinary.presets.blogs,

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

      console.log("e : ", e);
      console.log("data : ", data);
      console.log("attributes : ", attributes);

      Meteor.call('cImageUploadSave', attributes, function(error, id) {

        // console.log("Meteor.call('cImageUploadSave') : ", attributes, id, error);

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