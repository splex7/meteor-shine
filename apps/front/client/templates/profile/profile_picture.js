/**
 *  Display window for cropping profile image
 *    -picture
 */

/**
 *  local functions and variables
 *
 *  ---------------------------------------------------------------------------------------------
 *  func : isPictureOriginUrl
 *    info : Check if user has user's own profile picture
 *    @returns : Boolean
 *      false - only default profile picture exists
 *      true - user's own profile picture exists
 *  ---------------------------------------------------------------------------------------------
 *  func : isPictureTempUrl
 *    info : Check if user upload temporary image
 *    @returns : Boolean
 *      false - temporary image don't exist
 *      true - temporary image exists
 *  ---------------------------------------------------------------------------------------------
 *  func : getPictureOriginUrl
 *    info : return specific image url depending on profile picture state
 *    @returns : String
 *  ---------------------------------------------------------------------------------------------
 *  func : drawCropper
 *    info : drawing image on canvas using cropperjs after uploading image
 *    @returns :
 *    @params
 *      flag -
 *  ---------------------------------------------------------------------------------------------
 *  func : removeTempPicture
 *    info :
 *    @returns :
 *    @params
 *      check -
 *  ---------------------------------------------------------------------------------------------
 *
 */

var isPictureOriginUrl = function() {
  var user = Meteor.user();
  return !!(user && user.profile && user.profile.picture && user.profile.picture.origin);
};

var isPictureTempUrl = function() {
  var user = Meteor.user();
  return !!(user && user.profile && user.profile.picture && user.profile.picture.temp);
};

var getPictureOriginUrl = function() {
  var user = Meteor.user();
  var flag = profilePictureState(); // global func defined in profile.js

  switch (flag) {
    case 2  : return user.profile.picture.temp.url;
    break;
    case 1  : return user.profile.picture.origin.url;
    break;
    default : return DEFAULT_PICTURE_URL; // global constant defined in profile.js
  }
};

var removeTempPicture = function(check) {
  if (profilePictureState() === 2) {
    if (check)
      Meteor.users.update({ _id: Meteor.userId() }, { $unset: { 'profile.picture.temp': 1 }});
    else
      Meteor.users.update({ _id: Meteor.userId() }, { $unset: { 'profile.picture': 1 }});

    console.log('removeTempPicture : drawCropper depend setter');

    cropperDeps.changed();
  } else console.log('temporary image don`t exist!!!');
};


var cropperDeps = new Tracker.Dependency;

var drawCropper = function() {
  cropperDeps.depend();

  var avatarView = $('#avatarPreview');
  var url = getPictureOriginUrl();
  var isUrl = isPictureOriginUrl();
  var isTemp = isPictureTempUrl();
  var user = Meteor.user();

  if (isUrl) {
    if (isTemp) {
      avatarView.cropper('destroy').cropper();
      return;
    } else {
      console.log('only origin url');

      var canvasData = {
        left: user.profile.picture.coordinates.left,
        top: user.profile.picture.coordinates.top,
        width: user.profile.picture.coordinates.width,
        height: user.profile.picture.coordinates.height
      };
      var rotateData = {
        rotate: user.profile.picture.coordinates.rotate
      };

      avatarView.cropper({
        built: function() {
          avatarView.cropper('setCanvasData', canvasData);
          avatarView.cropper('setData', rotateData);
        }
      });

      return;
    }
  } else if (isTemp) {
    avatarView.cropper('replace', url);
    console.log('temp url & default url');
  } else {
    console.log('only default url');
  }

  console.log('drawCropper depend getter');
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
      $('#profileModal').modal('hide');
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

        console.log('updateCroppedImage call`s result: ', result);
        console.log('updateCroppedImage : drawCropper depend setter');
        cropperDeps.changed();
      });
    }
  },

  "click #rotateLeft": function(){
    var flag = profilePictureState();
    if (flag !== 0) $('#avatarPreview').cropper('rotate', -90);
  },
  "click #rotateRight": function(){
    var flag = profilePictureState();
    if (flag !== 0) $('#avatarPreview').cropper('rotate', 90);
  }
});

Template.profilePicture.onCreated(function() {
  // TODO remove the temp image of Meteor.user.profile if exists.
  if (isPictureTempUrl) {
    var check = isPictureOriginUrl();
    removeTempPicture(check);
  }
  //avatarView.cropper('destroy');
});

Template.profilePicture.onRendered(function() {
  Tracker.autorun(function() {
    console.log('drawCropper call');
    drawCropper();
  });

  $('#profileModal').on('show.bs.modal', function() {

  });

  $('#profileModal').on('hide.bs.modal', function() {
    var temp = isPictureTempUrl();
    if (temp) {
      var check = isPictureOriginUrl();
      removeTempPicture(check);
    }

  });

});

Template.profilePicture.onDestroyed(function() {
});

Template.profilePictureToolbar.onCreated(function(){
});

Template.profilePictureToolbar.onDestroyed(function(){
});

Template.profilePictureToolbar.onRendered(function() {

  // clicks upload button
  // shows window for selecting an image
  // select an image and then this method call
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
    console.log('data: ', data);

    var attributes = {
      url: data.result.url,
      surl: data.result.secure_url,
      size: data.result.bytes,
      width: data.result.width,
      height: data.result.height,
      ext: data.result.format,
      mime: data.originalFiles[0].type,
      original: data.originalFiles[0].name,
      repoId: data.result.public_id
    };

    Meteor.call('profileImagesInsert', attributes, function(error, result) {
      if(error) {
        console.log('error reason: ', error.reason);
      }
      console.log('profileImagesInsert', result);
      console.log('profileImagesInsert : drawCropper depend setter');

      cropperDeps.changed();
    });
  });

});
