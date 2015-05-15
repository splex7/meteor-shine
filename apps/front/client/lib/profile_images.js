checkDataContext = function() {
  console.log("Data Context: ", this);
};

/**
 * set default profile image
 *
 * @param
 */
defaultImgUrl = function() {
  return Meteor.absoluteUrl("images/default_profile.png");
};

/**
 * check profile image existence
 *
 * @param
 */
isProfileImage = function () {
  // current user object return
  var user = Meteor.user();

  if (user.profile) {
    return ProfileImages.findOne(user.profile.reference._id, {});
  } else{
    return false;
  }
};

// Register Global Helpers
Template.registerHelper('checkDataContext', checkDataContext);
Template.registerHelper('defaultImgUrl', defaultImgUrl);
Template.registerHelper('isProfileImage', isProfileImage);
