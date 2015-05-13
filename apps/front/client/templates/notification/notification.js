Template.notificationsList.helpers({
  notifications: function() {
    return Notifications.find();
  }
});

Template.notificationsList.events({
  'click #close': function(e) {
    e.preventDefault();

    $('#container').removeClass('notificationsSet');
  }
});

Template.notificationsListItem.events({
  'click li': function(e) {
    e.preventDefault();

    $('#container').removeClass('notifications-set');

    Meteor.call('notificationRead', this._id);

    Router.go(Meteor.absoluteUrl(this.msg.link));
  }
});
