/**
 * Display window for cropping profile image
 *    - picture
 *
 * Session
 *   - profileState
 *      0 : default profile image state
 *      1 : user`s profile image exist, but new image not yet uploaded
 *      2 : new image uploaded
 */

 var DEFAULT_IMAGE = "/images/default_profile.png";

Template.profilePicture.helpers({
  getAvatar: function() {
    var user = Meteor.user();
    var flag = Session.get('profileState');

    console.log('flag: ', flag);

    if(user.profile.picture.temp.url) {
      Session.set('profileState', 2);
      return user.profile.picture.temp.url
    }else if(flag === 1) {
      Session.set('profileState', 1);
      return user.profile.picture.url
    }
    Session.set('profileState', 0);
    return DEFAULT_IMAGE;

  }

});

Template.profilePicture.events({
  "click #saveBtn" : function(event, template) {
    var user = Meteor.user();

    var flag = Session.get('profileState');

    if (flag === 1 || flag === 2) {
      var cropData = $('#avatarPreview').cropper('getData');
      var canvasData = $('#avatarPreview').cropper('getCanvasData');

      cropData = {
        width: Math.round(cropData.width),
        height: Math.round(cropData.height),
        x: Math.round(cropData.x),
        y: Math.round(cropData.y),
        rotate: cropData.rotate
      }
      console.log(cropData);

      canvasData = {
        left: Math.round(canvasData.left),
        top: Math.round(canvasData.top),
        width: Math.round(canvasData.width),
        height: Math.round(canvasData.height),
        rotate: cropData.rotate
      }
      console.log(canvasData);

      var profileObj = {};

      if( flag === 1 ){
        profileObj._id = user.profile.picture._id;
        profileObj.repoId = user.profile.picture.repoId;
        profileObj.url = user.profile.picture.url;

      } else {
        profileObj._id = user.profile.picture.temp._id;
        profileObj.repoId = user.profile.picture.temp.repoId;
        profileObj.url = user.profile.picture.temp.url;
      }

      // this property is for cropping
      profileObj.cropData = cropData;
      // this property is for image positioning
      // when cropped image is reloaded.
      profileObj.canvasData = canvasData;

      console.log('profile object : ', profileObj);

      Meteor.call('updateCroppedImage', profileObj, flag, function(error, result) {
        if(error) {
          console.log('error reason: ', error.reason);
        }
        console.log('updateCroppedImage call result: ', result);
      });

    }
    $('#profileModal').modal('hide');
    },


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

  }

});


Template.profilePicture.onRendered(function() {
  $('#profileModal').on('hidden.bs.modal', function () {
    $('#avatarPreview').cropper('destroy');

    Meteor.call('temporaryProfileReset', function(error, result) {
      if(error) {
        console.log('error reason: ', error.reason);
      }
      console.log('result: ', result);
    });

  });

});

Template.profilePictureToolbar.onRendered(function() {
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
      if(result !== false) {
        $('#avatarPreview').cropper('destroy');
        $('#avatarPreview').cropper({
          built: function () {
            var cropBoxData = {
              width: 280,
              height: 280,
            };
            // Strict mode: set crop box data first
            $('#avatarPreview').cropper('setCropBoxData', cropBoxData);

            // CSS
            $('span.cropper-view-box > img').css('margin-left', '0');
            $('.avatar-preview').css({display: 'block'});
            $('.avatar-preview > img').css('margin-left', '0');
            $('#saveBtn').addClass('btn-primary').css({margin:0});
            $('#cancelBtn').removeClass('btn-primary');
            $('#cancelBtn').addClass('btn-default');
          },
        });
        // url change
        $('#avatarPreview').cropper('replace', data.result.url);
      }

    });
  });

});
