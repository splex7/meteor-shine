
Template.profilePicDialogs.helpers({
  tempProfile : function () {
    var user = Meteor.user();

    if(user && user.profile) {
      return Meteor.user().profile.image;
    }
  },
  images: function () {
    return ProfileImages.find({});
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

    var cropBoxData, canvasData;

    $('.avatar-wrapper > img').cropper('setCropBoxData', cropBoxData);
    $('.avatar-wrapper > img').cropper('setCanvasData', canvasData);

    cropBoxData = $('.avatar-wrapper > img').cropper('getCropBoxData');
    canvasData = $('.avatar-wrapper > img').cropper('getCanvasData');

    setTimeout(function(){
      $('.avatar-wrapper > img').cropper('reset');
    }, 1000);

    $('#profileModal').modal('hide');

    // test
    // console.log("cropBoxData", cropBoxData);
    // console.log("canvasData", canvasData);

  },

  "click #brightBtn": function() {

  },

});


Template.profilePicDialogs.onRendered(function() {

  $('.avatar-wrapper > img').cropper({
    aspectRatio: 1 / 1,
    preview: ".avatar-preview",
    autoCropArea: 1,
    strict: false,
    guides: false,
    highlight: false,
    dragCrop: false,
    movable: false,
    resizable: false,
    crop: function(data) {
    // Output the result data for cropping image.
    $("#dataX").val(Math.round(data.x));
    $("#dataY").val(Math.round(data.y));
    $("#dataHeight").val(Math.round(data.height));
    $("#dataWidth").val(Math.round(data.width));
    $("#dataRotate").val(Math.round(data.rotate));
    }
  });


    // convert the image to a texture
    /*var image = document.getElementsByClassName('texture');
    console.log(image);*/
    /*var texture = canvas.texture(image);
    console.log(texture);

    // apply the ink filter
    canvas.draw(texture).ink(0.7).update();

    // replace the image with the canvas
    image.parentNode.insertBefore(canvas, image);
    image.parentNode.removeChild(image);*/

});
