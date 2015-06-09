DEFAULT_PICTURE_URL = '/images/default_profile.png';

/**
 *  0 : default profile image state
 *  1 : user`s profile image exist, but new image not yet uploaded
 *  2 : new image uploaded
 *
 * @returns number
 */
profilePictureState = function() {
  var user = Meteor.user();

  if (user && user.profile && user.profile.picture) {
    return (user.profile.picture.temp) ?  2 : 1;
  }

  return 0;
};

/**
 *  false : only default profile url exists
 *  true : original profile url exists
 *
 * @returns Boolean
 */
originPictureCheck = function() {
  var user = Meteor.user();

  if (user && user.profile && user.profile.picture && user.profile.picture.origin) {
    return true
  }
  return false
}

Template.registerHelper('getOriginAvatar', function() {
    var user = Meteor.user();
    var flag = profilePictureState();

    switch (flag) {
      case 2  : return user.profile.picture.temp.url;
        break;
      case 1  : return user.profile.picture.origin.url;
        break;
      default : return DEFAULT_PICTURE_URL;
        break;
    }
});

Template.registerHelper('getCroppedAvatar', function() {
    var user = Meteor.user();

    if (user && user.profile && user.profile.picture && user.profile.picture.origin) {
      return user.profile.picture.origin.urlCropped;
    } else {
      return DEFAULT_PICTURE_URL;
    }
});
