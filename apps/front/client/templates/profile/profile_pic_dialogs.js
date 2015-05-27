
Template.profilePicDialogs.helpers({
  getOriginUrl: function() {
    var user = Meteor.user();

    if(user.profile.tempUrl) {
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

  "click #resetBtn": function() {
    $('.avatar-wrapper > img').cropper('reset');
  }
});
