
Template.profilePicDialogs.helpers({
  getOriginUrl: function() {
    var user = Meteor.user();

    if(user && user.profile.tempUrl) {
     return user.profile.tempUrl
    } else if(user.profile.originUrl) {
      return user.profile.originUrl
    }

    return user.profile.avatarUrl
  }

});

Template.profilePicDialogs.events({

  "click #rotateLeft": function(event, template){
    $('.avatar-wrapper > img').cropper('rotate', -90);
  },

  "click #rotateRight": function(event, template){
    $('.avatar-wrapper > img').cropper('rotate', 90);
  },

  "click #saveBtn" : function() {
    var cropData = $('#avatarPreview').cropper('getData');
    var canvasData = {};

    canvasData = $('#avatarPreview').cropper('getCanvasData');
    canvasData.left = Math.round(canvasData.left);
    canvasData.top = Math.round(canvasData.top);
    canvasData.width = Math.round(canvasData.width);
    canvasData.height = Math.round(canvasData.height);
    canvasData.rotate = cropData.rotate;

    console.log(canvasData);

    var originUrl = $('#avatarPreview')[0].src;

    var croppedImgage = $.cloudinary.fetch_image(originUrl,
      {
        crop: 'crop',
        width: Math.round(cropData.width),
        height: Math.round(cropData.height),
        x: Math.round(cropData.x),
        y: Math.round(cropData.y),
        angle: cropData.rotate,
        fetch_format: 'png'
      });

    if(!croppedImgage) {
      console.log('fetch failed', croppedImgage);
    } else {

      console.log('fetch success: ', croppedImgage);

      var croppedUrl = croppedImgage[0].src;
      var publicId = Meteor.user().profile.tempId;

      if(publicId === "") {
        publicId = Meteor.user().profile.publicId;
      }

      console.log('publicId: ', publicId);

      Meteor.call('updateProfileUrl', originUrl, croppedUrl, publicId, canvasData);

      $('#profileModal').modal('hide');
      Router.go('profileView');
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
      api_key: Meteor.settings.public.cloudinary.apiKey
    },
    buttonHTML: '<i class="fa fa-upload">',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {

    // $().cropper(options);
    // $.fn.cropper.setDefaults(options).
    $('#avatarPreview').cropper('destroy');

    var cropBoxData = {};
    cropBoxData.width = 300;
    cropBoxData.height = 300;

    $('#avatarPreview').cropper({
      aspectRatio: 1/1,
      autoCropArea: 1,
      strict: false,
      responsive: false,
      background: false,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      preview: '.avatar-preview',
      built: function() {
        // Strict mode: set crop box data first
        $('#avatarPreview').cropper('setCropBoxData', cropBoxData);
      },
    });

    var tempId = data.result.public_id;
    var tempUrl = data.result.url;

    $('#avatarPreview').cropper('replace', tempUrl);

    var userId = Meteor.user()._id;

    console.log('original image upload done');

    Meteor.call('uploadOriginImage', tempId, tempUrl, userId);
  });
});