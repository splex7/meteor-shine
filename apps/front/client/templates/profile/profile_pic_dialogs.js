
Template.profilePicDialogs.helpers({

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
