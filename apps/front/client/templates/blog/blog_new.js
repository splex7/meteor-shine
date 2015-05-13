// function urlify(text) {
//     var urlRegex = /(https?:\/\/[^\s]+)/g;
//     // return text.replace(urlRegex, function(url) {
//     //     return '<a href="' + url + '">' + url + '</a>';
//     // })
//     // or alternatively
//     return text.replace(urlRegex, '<a href="$1">$1</a>')
// };

// function handlepaste (elem, e) {
//     var savedcontent = elem.innerHTML;
//     if (e && e.clipboardData && e.clipboardData.getData) {// Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
//         if (/text\/html/.test(e.clipboardData.types)) {
//             elem.innerHTML = e.clipboardData.getData('text/html');
//         }
//         else if (/text\/plain/.test(e.clipboardData.types)) {
//             elem.innerHTML = e.clipboardData.getData('text/plain');
//         }
//         else {
//             elem.innerHTML = "";
//         }
//         waitforpastedata(elem, savedcontent);
//         if (e.preventDefault) {
//                 e.stopPropagation();
//                 e.preventDefault();
//         }
//         return false;
//     }
//     else {// Everything else - empty editdiv and allow browser to paste content into it, then cleanup
//         elem.innerHTML = "";
//         waitforpastedata(elem, savedcontent);
//         return true;
//     }
// };

// function waitforpastedata (elem, savedcontent) {
//     if (elem.childNodes && elem.childNodes.length > 0) {
//         processpaste(elem, savedcontent);
//     }
//     else {
//         that = {
//             e: elem,
//             s: savedcontent
//         }
//         that.callself = function () {
//             waitforpastedata(that.e, that.s)
//         }
//         setTimeout(that.callself,20);
//     }
// };

// function processpaste (elem, savedcontent) {
//     pasteddata = elem.innerHTML;
//     //^^Alternatively loop through dom (elem.childNodes or elem.getElementsByTagName) here

//     elem.innerHTML = savedcontent;
//     //var finalPaste = pasteddata.replace(/(<([^>]+)>)/ig, "");

//     UniHTML.setNewAllowedAttributes(['href'], 'all_elements');

//     var finalPaste = UniHTML.purify(pasteddata, {
//       withoutTags: ['table', 'span', 'pre', 'p', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'br', 'a'],
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

// };


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
  var editor = $('#editor');
  //$(editor).focus();

  // Mouse Up Events
  $(document).mouseup( function () {
    setTimeout( function() {
      inlineEditor.isSelected();
    }, 1);
  });

  // Mouse Down Events
  $(document).mousedown( function () {
    inlineEditor.isSelected();
  });

  $(editor).on('keydown', function (e) {
    e.preventDefault;
    inlineEditor.preventBackspace(e);
  });

  $(document).on('paste' , function() {
    console.log('pasting!');
    //console.log(this);
    console.log(event);
    inlineEditor.handlepaste(this, event);
  });

  // Key Up
  $(editor).on('keyup', function (e) {
    inlineEditor.editorKeyUp(e);
    inlineEditor.preventBackspace(e);
    inlineEditor.isSelected(editor);
  });

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
