/**
 * Display user information
 *    - picture
 *    - profile
 */

var TEMPLATE_PROFILE = 'templateProfile';
var EDIT_PASSWORD = 'editPassword';


Template.profileView.helpers({
  templateProfile: function() {
    return Session.get(TEMPLATE_PROFILE) || 'profileEditNormal';
  },

  editPassword: function() {
    return Session.get(EDIT_PASSWORD) || false;
  }

});

Template.profileView.events({

  "click #editPicture": function() {
    $('#profileModal').modal('show');
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


});

Template.profileView.onDestroyed(function() {
  Blaze.remove(Template.profilePicture);
});
