
Template.profileView.helpers({
  getAvatarUrl: function() {
    var user = Meteor.user();

    if(user.profile.tempUrl) {
     return user.profile.tempUrl
    }

    return user.profile.avatarUrl
  }

});

Template.profileView.events({
  "click .avatar-wrapper-custom img, click .picture-finder": function() {
    // alert('test');
    // set Cropperjs's options

    $('#avatarPreview').cropper({
      aspectRatio: 1/1,
      autoCropArea: 1,
      strict: true,
      guides: true,
      responsive: false,
      background: false,
      modal: false,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      rotatable: false,
      minCanvasWidth: 300,
      minCropBoxWidth: 300,
      minCropBoxHeight: 300,
      minContainerWidth: 300,
      minContainerHeight: 300,
      preview: '.avatar-preview',
    });
    Meteor.setTimeout(function(){
      $('#profileModal').modal('show');
    }, 300);

  },
});

Template.profileView.onRendered(function() {
  // click upload button, so show pop up window for selecting an image
  // set Cropperjs
  // Listen modal's `show` and `hide` events

  $('#profileModal').on('hidden.bs.modal', function () {
    $('#avatarPreview').cropper('destroy');
  });

  // code here for upload profile photo to cloudinary server
  // using jquery file upload & cloudinary
  $('#saveBtn').on('click', function() {
    console.log('saveBtn this: ', this);

    var cropData = $('#avatarPreview').cropper('getData');

    var newWidth = Math.round(cropData.width);
    var newHeight = Math.round(cropData.height);
    var newX = Math.round(cropData.x);
    var newY = Math.round(cropData.y);
    var newRotate = cropData.rotate;

    var originUrl = $('#avatarPreview')[0].src;

    var croppedImgage = $.cloudinary.fetch_image(originUrl,
      {
        crop: 'crop',
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
        angle: newRotate,
        fetch_format: 'png'
      });

    if(!croppedImgage) {

      console.log('fetch failed');

    } else {

      console.log('fetch success: ', croppedImgage);

      var croppedUrl = croppedImgage[0].src;
      var publicId = Meteor.user().profile.tempId;

      if(publicId === "") {
        publicId = Meteor.user().profile.publicId;
      }

      console.log('publicId: ', publicId);

      Meteor.call('updateProfileUrl', originUrl, croppedUrl, publicId);

      $('#profileModal').modal('hide');
      Router.go('profileView');
    }
  });


  Cloudinary.uploadImage({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      api_key: Meteor.settings.public.cloudinary.apiKey
    },
    buttonHTML: '<i class="fa fa-upload">사진선택',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {
    $('#avatarPreview').cropper('reset');
    // $('#avatarPreview').cropper('destroy');

    var tempId = data.result.public_id;
    var tempUrl = data.result.url;

    $('#avatarPreview').cropper('replace', tempUrl);

    var userId = Meteor.user()._id;

    console.log("tempId: ", tempId);
    console.log('original image upload done');

    Meteor.call('uploadOriginImage', tempId, tempUrl, userId);

    $('#avatarPreview').cropper({
          aspectRatio: 1/1,
          autoCropArea: 1,
          strict: false,
          guides: true,
          responsive: false,
          background: false,
          modal: false,
          highlight: false,
          dragCrop: false,
          movable: false,
          resizable: false,
          rotatable: false,
          minCanvasWidth: 300,
          minCropBoxWidth: 300,
          minCropBoxHeight: 300,
          minContainerWidth: 300,
          minContainerHeight: 300,
          preview: '.avatar-preview',
        });


  });
});