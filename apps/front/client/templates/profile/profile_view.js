
Template.profileView.helpers({
  getAvatarUrl: function() {
    var user = Meteor.user();
    return user.profile.avatarUrl
  }

});

Template.profileView.events({
  "click .avatar-wrapper-custom img, click .picture-finder": function() {
    // Default crop box data property setting
    var cropBoxData = {};
    cropBoxData.width = 270;
    cropBoxData.height = 270;

    $('#avatarPreview').cropper({
      aspectRatio: 1/1,
      autoCropArea: 1,
      strict: false,
      responsive: false,
      background: false,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      preview: '.avatar-preview',
      built: function() {
        // Strict mode: set crop box data first
        $('#avatarPreview').cropper('setCropBoxData', cropBoxData);
      },
    });

    $('#profileModal').modal('show');
  },
});
