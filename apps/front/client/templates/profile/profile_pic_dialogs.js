
Template.profilePicDialogs.helpers({

});

Template.profilePicDialogs.events({
  "click #rotateLeft": function(event, template){
    $('.profile-wrapper > img').cropper('rotate', -90);
  },
  "click #rotateRight": function(event, template){
    $('.profile-wrapper > img').cropper('rotate', 90);
  },
  "click #resetBtn": function() {
    $('.profile-wrapper > img').cropper('reset');
  },
  "click #saveBtn": function() {

    var cropBoxData, canvasData;

    $('.profile-wrapper > img').cropper('setCropBoxData', cropBoxData);
    $('.profile-wrapper > img').cropper('setCanvasData', canvasData);

    cropBoxData = $('.profile-wrapper > img').cropper('getCropBoxData');
    canvasData = $('.profile-wrapper > img').cropper('getCanvasData');

    // console.log("cropBoxData", cropBoxData);
    // console.log("canvasData", canvasData);

    $('#profileModal').modal('hide');

    setTimeout(function(){
      $('.profile-wrapper > img').cropper('reset');
    }, 1000);

  },

});


Template.profilePicDialogs.onRendered(function() {

  $('.profile-wrapper > img').cropper({
    aspectRatio: 1 / 1,
    autoCropArea: 1,
    strict: false,
    guides: false,
    highlight: false,
    dragCrop: false,
    movable: false,
    resizable: false,
    crop: function(data) {
    // Output the result data for cropping image.
    }
  });

});
