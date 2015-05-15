Template.blogNew.created = function() {
  TempImages.remove({});
};

Template.blogNew.destroyed = function() {
  TempImages.remove({});

  $('.cloudinary-uploader input').off('click');
};

//--------------------------------------------------------
//
//  TEMPLATE CALL BACKS FROM HERE
//
//--------------------------------------------------------

Template.blogNew.helpers({
  editable: function() {
    // +Added id="editor"
    return '<div class="editable" contenteditable="true" name="content" id="editor" data-default="true"><p class="is-selected">본문</p></div>';
  },
  title: function() {
    return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="false" data-default="true">제목</h2>';
  }
});

Template.blogNew.events({
  'submit #formBlogNew': function(e) {
    e.preventDefault();

    var finalContent = $('[name=content]').html;


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

    if( titleLength === 0 ){
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

  'focus #editor': function () {
    $('#editor').addClass('editor-on');
  },

  'blur #editor': function () {
    $('#editor').removeClass('editor-on');
  }
});

Template.blogNew.onRendered( function (){

  //$('#wysiwyg').wysiwyg();

  var editor = '#editor';
  var editorTitle = '#newTitle';
  inlineEditor.init(editor, editorTitle);

  // Cloudinary Upload Image
  cloudinaryDirectUpload(
    {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      preset: Meteor.settings.public.cloudinary.presets.test,
      progress_bar_selecter: '.progress-wrapper'
    },
    { multiple: true },
    function (e, data) {
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
