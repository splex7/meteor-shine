
Template.profileEdit.onRendered(function() {
  // click upload button, so show pop up window for selecting an image
  // set Cropperjs
  var $image = $('#avatarPreview');
  var cropData;

  // Listen modal's `show` and `hide` events
  $('#profileModal').on('shown.bs.modal', function () {
    // set Cropperjs's options
    $image.cropper({
      aspectRatio: 1 / 1,
      autoCropArea: 0.85,
      strict: false,
      guides: false,
      highlight: false,
      dragCrop: false,
      // movable: false,
      // resizable: false,
      preview: '.avatar-preview'
    });
  }).on('hidden.bs.modal', function () {
    $image.cropper('destroy');
  });

  // code here for upload profile photo to cloudinary server
  // using jquery file upload & cloudinary
  $('#saveBtn').on('click', function() {
    cropData = $image.cropper('getData');

    var newWidth = Math.round(cropData.width);
    var newHeight = Math.round(cropData.height);
    var newX = Math.round(cropData.x);
    var newY = Math.round(cropData.y);
    var newRotate = cropData.rotate;

    var imgSrc = $('#avatarPreview')[0].src;

    var fetchedImgage = $.cloudinary.fetch_image(imgSrc,
      {
        crop: 'crop',
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
        angle: newRotate,
        fetch_format: 'png'
      });

    if(!fetchedImgage) {

      console.log('fetch failed');

    } else {

      console.log('fetch success');

      var fetchedUrl = fetchedImgage[0].src;
      var user = Meteor.user();

      console.log(user);

      Meteor.call('updateProfileUrl', fetchedUrl, user);

      $('#profileModal').modal('hide');
      Router.go('profileEdit');
    }
  });


  Cloudinary.uploadImage({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      api_key: Meteor.settings.public.cloudinary.apiKey
    },
    buttonHTML: '<i class="fa fa-upload"> 업로드',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {
    $('#profileModal').modal('show');
    // this is modal's img element
    var img = $('#avatarPreview')[0];
    img.src = data.result.url;
    var publicId = data.result.public_id;
    var originUrl = data.result.url;

    var userId = Meteor.user()._id;

    console.log("publicId: ", publicId);

    console.log('original image upload done');

    Meteor.call('updateProfileId', publicId, originUrl, userId, function() {}

    );

  });

});