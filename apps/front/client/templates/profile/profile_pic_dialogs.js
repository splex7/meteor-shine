
Template.profilePicDialogs.helpers({
  getOriginUrl: function() {
    var user = Meteor.user();

    if(user && user.profile){
      if(user.profile.tempUrl) {
        return user.profile.tempUrl
      } else if(user.profile.originUrl) {
        return user.profile.originUrl
      } else return user.profile.avatarUrl
    }

    return "";
  }

});

Template.profilePicDialogs.events({

  "click #rotateLeft": function(event, template){
    var user = Meteor.user();
    if (! (user.profile.avatarUrl === "/images/default_profile.png") ) {
      $('#avatarPreview').cropper('rotate', -90);
    } else if (user.profile.tempUrl) {
      $('#avatarPreview').cropper('rotate', -90);
    }
  },

  "click #rotateRight": function(event, template){
    var user = Meteor.user();
    if (! (user.profile.avatarUrl === "/images/default_profile.png") ) {
      $('#avatarPreview').cropper('rotate', 90);
    } else if (user.profile.tempUrl) {
      $('#avatarPreview').cropper('rotate', 90);
    }
  },

  "click #deleteBtn": function(event, template){
    // unsigned image delete(원본 삭제됨)
    // /meteor-shine/image/upload?public_ids=
    // /resources/image/upload?public_ids=image1,image2
    var user = Meteor.user();

    console.log('avatarUrl: ',user.profile.avatarUrl);
    console.log('tempUrl: ', user.profile.tempUrl);

    if (!(user.profile.avatarUrl === "/images/default_profile.png") || user.profile.tempUrl ) {
      Meteor.call("removeImage", user.profile.publicId, function(err,result){
          if(err){
            console.log(err);
          } else {
            console.log('profile image delete result: ', result);

            Meteor.call('defaultProfile');

            $('#avatarPreview').cropper('destroy');

            $('.cloudinary-uploader > .btn').removeClass('btn-default');
            $('.cloudinary-uploader > .btn').addClass('btn-primary').css({margin:0});
            $('.avatar-preview').css({display: 'none'});
            $('#saveBtn').removeClass('btn-primary');
            $('#saveBtn').addClass('btn-default');
            $('#cancelBtn').removeClass('btn-default');
            $('#cancelBtn').addClass('btn-primary');

          }
      });
    }

  },

  "click #saveBtn" : function(event, template) {
    var user = Meteor.user();
    if (!(user.profile.avatarUrl === "/images/default_profile.png") || user.profile.tempUrl ) {

      var cropData = $('#avatarPreview').cropper('getData');
      var canvasData = {};

      canvasData = $('#avatarPreview').cropper('getCanvasData');
      canvasData.left = Math.round(canvasData.left);
      canvasData.top = Math.round(canvasData.top);
      canvasData.width = Math.round(canvasData.width);
      canvasData.height = Math.round(canvasData.height);
      canvasData.rotate = cropData.rotate;

      console.log(cropData);
      console.log(canvasData);

      var originUrl = $('#avatarPreview')[0].src;

      var croppedImage = $.cloudinary.fetch_image(originUrl,
        {
          crop: 'crop',
          width: Math.round(cropData.width),
          height: Math.round(cropData.height),
          x: Math.round(cropData.x),
          y: Math.round(cropData.y),
          angle: cropData.rotate,
          fetch_format: 'png'
        });

      if(!croppedImage) {
        console.log('fetch failed', croppedImage);
      } else {

        console.log('fetch success: ', croppedImage);

        var croppedUrl = croppedImage[0].src;
        var publicId = Meteor.user().profile.tempId;

        if(publicId === "") {
          publicId = Meteor.user().profile.publicId;
        }

        console.log('publicId: ', publicId);

        Meteor.call('updateProfileUrl', originUrl, croppedUrl, publicId, canvasData);

        $('#profileModal').modal('hide');
        Router.go('profileView');
      }
    }




  },
});

Template.profilePicDialogs.onRendered(function() {

  $('#profileModal').on('hidden.bs.modal', function () {

    $('#avatarPreview').cropper('destroy');
    Meteor.call('deleteTempUrl');

  });

  Cloudinary.uploadImage({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
    },
    buttonHTML: '<i class="fa fa-upload">',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {

    console.log('returned data: ', data.result);

    // $().cropper(options);
    // $.fn.cropper.setDefaults(options).
    $('#avatarPreview').cropper('destroy');

    var cropBoxData = {};
    cropBoxData.width = 280;
    cropBoxData.height = 280;
    cropBoxData.x = 0;
    cropBoxData.y = 0;

    $('#avatarPreview').cropper({
      aspectRatio: 1/1,
      autoCropArea: 1,
      strict: true,
      minCanvasWidth: 280, // Width of canvas-container to keep 1:1 at all times
      // minCanvasWidth: 280, // Width of canvas-container to keep 1:1 at all times
      responsive: false,
      background: true,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      preview: '.avatar-preview',
      build: function () {

      },
      built: function () {
        // Strict mode: set crop box data first
        $('#avatarPreview').cropper('setCropBoxData', cropBoxData);
        $('span.cropper-view-box > img').css('margin-left', '0');
        $('.avatar-preview').css({display: 'block'});
        $('.avatar-preview > img').css('margin-left', '0');
        $('#saveBtn').addClass('btn-primary').css({margin:0});
        $('#cancelBtn').removeClass('btn-primary');
        $('#cancelBtn').addClass('btn-default');
        // $('.cropper-view-box img, .cropper-canvas img').css('margin', '0');
      },
    });

    var tempId = data.result.public_id;
    var tempUrl = data.result.url;

    $('#avatarPreview').cropper('replace', tempUrl);

    console.log('original image upload done');

    Meteor.call('uploadOriginImage', tempId, tempUrl);
  });
});
