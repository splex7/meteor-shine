
Template.profilePicDialogs.helpers({
  profileImage: function () {
    // current user object return
    var user = Meteor.user();
    if(user && user.profile) {
      return ProfileImages.findOne(user.profile.reference._id, {});
    }
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
  },

  "click #saveBtn": function() {





    /*var cropBoxData, canvasData;

    $('.avatar-wrapper > img').cropper('setCropBoxData', cropBoxData);
    $('.avatar-wrapper > img').cropper('setCanvasData', canvasData);

    cropBoxData = $('.avatar-wrapper > img').cropper('getCropBoxData');
    canvasData = $('.avatar-wrapper > img').cropper('getCanvasData');

    setTimeout(function(){
      $('.avatar-wrapper > img').cropper('reset');
    }, 1000);*/

    $('#profileModal').modal('hide');
  },

  "click #cancelBtn": function() {
    var user = Meteor.user();
    var photoId = user.profile.reference._id;

    Meteor.call("profileRemove", photoId, function(error, result){
      if(error){
        console.log("error: ", error);
      }
      if(result){
        console.log("result: ", result);
      }
    });
  },

});


Template.profilePicDialogs.onRendered(function() {


});
