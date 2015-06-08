/**
 * Display user information
 *    - picture
 *    - profile
 */

var TEMPLATE_PROFILE = 'templateProfile';
var EDIT_PASSWORD = 'editPassword';


Template.profileView.helpers({
  getAvatar: function() {
    var user = Meteor.user();

    if (user && user.profile && user.profile.picture) {
      return user.profile.picture.urlCropped;
    } else {
      return DEFAULT_PICTURE_URL;
    }
  },

  templateProfile: function() {
    return Session.get(TEMPLATE_PROFILE) || 'profileEditNormal';
  },

  editPassword: function() {
    return Session.get(EDIT_PASSWORD) || false;
  }

});

Template.profileView.events({

  "click #editPicture": function() {
    var user = Meteor.user();
    // 유저가 업로드한 프로필 이미지가 있는 경우
    var flag = Session.get('profileState');

    if(flag === 1 || flag === 2) {
      var canvasData = {
        left: user.profile.picture.coordinates.left,
        top: user.profile.picture.coordinates.top,
        width: user.profile.picture.coordinates.width,
        height: user.profile.picture.coordinates.height,
      };
      var rotateValue = user.profile.picture.coordinates.rotate;

      $('#avatarPreview').cropper({
        //this function fires when a cropper instance has built completely
        built: function() {
          var cropBoxData = {
            width: 280,
            height: 280,
          };
          // Strict mode: set crop box data first
          $('#avatarPreview').cropper('setCropBoxData', cropBoxData);
          $('#avatarPreview').cropper('setCanvasData', canvasData);
          $('#avatarPreview').cropper('rotate', rotateValue);
        }
      });
      // console.log('canvasData: ', canvasData);
      $('#profileModal').modal('show');

    } else {
      $('#profileModal').modal('show');
      // for CSS problems
      $('.cloudinary-uploader > .btn').addClass('btn-primary').css({margin:0});
      $('#cancelBtn').addClass('btn-primary').css({margin:0});
      $('.avatar-preview').css({ display: 'none'});
    }
  },


  'click #editProfile': function() {
    var template = Session.get(TEMPLATE_PROFILE);
    if (template === 'profileEditForm')
      Session.set(TEMPLATE_PROFILE, 'profileEditNormal');
    else
      Session.set(TEMPLATE_PROFILE, 'profileEditForm');
  },

  'click #editPassword': function() {
    var edit = Session.get(EDIT_PASSWORD);
    Session.set(EDIT_PASSWORD, ! edit);
  }
});

Template.profileView.onCreated(function() {
  Blaze.render(Template.profilePicture, document.body);
});

Template.profileView.onRendered(function() {
  // when modal close, cropper container destroies
  $('#profileModal').on('hidden.bs.modal', function () {
    $('#avatarPreview').cropper('destroy');
  });

});

Template.profileView.onDestroyed(function() {
  Blaze.remove(Template.profilePicture);
});

