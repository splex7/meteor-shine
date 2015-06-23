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

makeUpperCase = function(str) {
  return str.slice(0, 1).toUpperCase();
};

getAccountPicture = function() {
  var user = Meteor.user();
  if (user && user.profile) {
    if (user.profile.picture) {
      var url = user.profile.picture.origin.urlCropped;
      return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
    }
  }
  var firstChar = makeUpperCase(user.username);
  return "<span class='avatar-initials'>"+firstChar+"</span>";
};

Template.registerHelper('authorPicture', function () {
  var blog = this.blog;

  var author = Meteor.users.findOne({_id: blog.user._id});

  if (blog && blog.user && author.profile) {
    var url = author.profile.picture.origin.urlCropped;
    return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
  }

  if (blog && blog.user && blog.user.username) {
    var firstChar = makeUpperCase(blog.user.username);
    return "<span class='avatar-initials'>"+firstChar+"</span>";
  }
});

Template.registerHelper('accountPicture', function() {
  return getAccountPicture();
});

Template.registerHelper('defaultImage', function(username) {
  return makeUpperCase(username);
});
