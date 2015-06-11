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

removeTempPicture = function(check) {
  if (profilePictureState() === 2) {
    Meteor.call('temporaryProfileReset', check, function(error, result) {
      if (error) console.log('error reason: ', error.reason);
      console.log(result+': temporary image remove success!!!');
    });
  } else console.log('temporary image don`t exist!!!');

};

getAccountPictureUrl = function() {
  var user = Meteor.user();

  if (user && user.profile && user.profile.picture && user.profile.picture.origin) {
    return user.profile.picture.origin.urlCropped;
  } else {
    return DEFAULT_PICTURE_URL;
  }
};

Template.registerHelper('accountPictureUrl', function() {
  return getAccountPictureUrl();
});
