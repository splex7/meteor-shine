Template.userList.created = function () {
  Meteor.subscribe("userStatus");
}

Template.userList.helpers({
  usersOnline : function() {
    return Meteor.users.find({ "status.online": true });
  },
});
