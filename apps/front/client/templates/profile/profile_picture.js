/**
 * Display window for cropping profile image
 *    - picture
 *
 */

/**
 *  false : only default profile url exists
 *  true : original profile url exists
 *
 * @returns Boolean
 */
var isPictureOriginUrl = function() {
  var user = Meteor.user();
  return !!(user && user.profile && user.profile.picture && user.profile.picture.origin);
};

var getPictureOriginUrl = function() {
  var user = Meteor.user();
  var flag = profilePictureState();

  switch (flag) {
    case 2  : return user.profile.picture.temp.url;
    break;
    case 1  : return user.profile.picture.origin.url;
    break;
    default : return DEFAULT_PICTURE_URL;
  }
};

Template.profilePicture.helpers({
  pictureOriginUrl: function() {
    return getPictureOriginUrl();
  }

});

Template.profilePicture.events({
  "click #saveBtn" : function() {
    var user = Meteor.user();
    var flag = profilePictureState();
    var previewAvatar = $('#avatarPreview');

    if (!(flag === 1 || flag === 2)) {
    } else {
      var cropData = previewAvatar.cropper('getData');
      var canvasData = previewAvatar.cropper('getCanvasData');
      var profileObj = {};

      if (flag === 1) {
        profileObj._id = user.profile.picture.origin._id;
        profileObj.repoId = user.profile.picture.origin.repoId;
        profileObj.url = user.profile.picture.origin.url;

      } else {
        profileObj._id = user.profile.picture.temp._id;
        profileObj.repoId = user.profile.picture.temp.repoId;
        profileObj.url = user.profile.picture.temp.url;
      }

      $('#profileModal').modal('hide');

      cropData = {
        width: Math.round(cropData.width),
        height: Math.round(cropData.height),
        x: Math.round(cropData.x),
        y: Math.round(cropData.y),
        rotate: cropData.rotate
      };

      canvasData = {
        left: Math.round(canvasData.left),
        top: Math.round(canvasData.top),
        width: Math.round(canvasData.width),
        height: Math.round(canvasData.height),
        rotate: cropData.rotate
      };

      profileObj.cropData = cropData;
      profileObj.canvasData = canvasData;

      Meteor.call('updateCroppedImage', profileObj, flag, function (error, result) {
        if (error) console.log('error reason: ', error.reason);
        console.log(result + ': updateCroppedImage call`s result');
      });
    }
  },

  "click #rotateLeft": function(){
    var flag = profilePictureState();
    if (flag === 1 || flag === 2) $('#avatarPreview').cropper('rotate', -90);
  },

  "click #rotateRight": function(){
    var flag = profilePictureState();
    if (flag === 1 || flag === 2) $('#avatarPreview').cropper('rotate', 90);
  }

});

Template.profilePicture.onCreated(function() {
  // TODO remove the temp image of Meteor.user.profile if exists.
  var avatarView = $('#avatarPreview');
  var check = isPictureOriginUrl();
  removeTempPicture(check);
  avatarView.cropper('destroy');
});

Template.profilePicture.onRendered(function() {
  var user = Meteor.user();

  var avatarView = $('#avatarPreview');
  var check = isPictureOriginUrl();

  if (check === true) {
    var canvasData = {
      left: user.profile.picture.coordinates.left,
      top: user.profile.picture.coordinates.top,
      width: user.profile.picture.coordinates.width,
      height: user.profile.picture.coordinates.height
    };
    var rotateValue = user.profile.picture.coordinates.rotate;

    avatarView.cropper({
      //this function fires when a cropper instance has built completely
      built: function() {

      }
    });
  } else {
    $('.avatar-preview').css({ display: 'none'});
  }


  $('#profileModal').on('show.bs.modal', function() {

  });

  $('#profileModal').on('hide.bs.modal', function() {
    var avatarView = $('#avatarPreview');
    var check = isPictureOriginUrl();

    removeTempPicture(check);
    setTimeout(function() {
      avatarView.cropper('destroy');
      console.log('destroy');
    }, 300);

  });

  // Tracker.autorun(function() { });

});

Template.profilePicture.onDestroyed(function() {
  console.log('profilePicture onDestroyed');
});

Template.profilePictureToolbar.onCreated(function(){
  console.log('profilePictureToolbar onCreated');
});
Template.profilePictureToolbar.onDestroyed(function(){
  console.log('profilePictureToolbar onDestroyed');
});

Template.profilePictureToolbar.onRendered(function() {
  console.log('profilePictureToolbar onRendered');
  // When user clicks upload button, window for selecting an image shows
  // and then uploadImagePreset method excutes after selecting an image
  Cloudinary.uploadImagePreset({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      api_key: Meteor.settings.public.cloudinary.apiKey,
      presets: {
        accounts: Meteor.settings.public.cloudinary.presets.accounts,
        blogs: Meteor.settings.public.cloudinary.presets.blogs
      }
    },
    preset: Meteor.settings.public.cloudinary.presets.accounts,
    buttonHTML: '<i class="fa fa-upload">',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {
    console.log('returned data from cloudinary : ', data.result);

    var attributes = {
      url: data.result.url,
      surl: data.result.secure_url,
      size: data.result.bytes,
      width: data.result.width,
      height: data.result.height,
      // urlFit: data.result.eager[0].url,
      // surlFit: data.result.eager[0].secure_url,
      // widthFit: data.result.eager[0].width,
      // heightFit: data.result.eager[0].height,
      ext: data.result.format,
      mime: data.originalFiles[0].type,
      original: data.originalFiles[0].name,
      repoId: data.result.public_id
    };

    Meteor.call('profileImagesInsert', attributes, function(error, result) {
      if(error) {
        console.log('error reason: ', error.reason);
      }
      console.log(result);
      if (result) {
        console.log('insert success!!!');

        // TODO save the uploaded file information to ProfileImages and Temp data of Meteor.user.profile.picture
        var setData,
        canvasData;
        $('#avatarPreview').cropper('replace', data.result.url);
        $('#avatarPreview').cropper({
          built: function() {
            $('#avatarPreview').cropper('setData', setData);
            $('#avatarPreview').cropper('setCanvasData', canvasData);
          }

        });

        /*
        var avatarPreview = $('#avatarPreview');
        avatarPreview.cropper('destroy')
                           .cropper({
          built: function () {
            var cropBoxData = {
              width: 280,
              height: 280
            };
            // Strict mode: set crop box data first
            $('#avatarPreview').cropper('setCropBoxData', cropBoxData);

            var canvasData = {
              left:
            };

            // CSS
            $('span.cropper-view-box > img').css('margin-left', '0');
            $('.avatar-preview').css({display: 'block'});
            $('.avatar-preview > img').css('margin-left', '0');
            $('#saveBtn').addClass('btn-primary').css({margin:0});
            $('#cancelBtn').removeClass('btn-primary')
                           .addClass('btn-default');
          }
        });
        // url change
        avatarPreview.cropper('replace', data.result.url);
        */
      }

    });
  });

});
