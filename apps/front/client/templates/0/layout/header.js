Template.headerDefault.helpers({
  notificationsCount: function() {
    return Counts.get('notificationsUnreadCount');
  }
});


Template.headerDefault.events({
  'click [data-toggle=aside-left]': function() {
    $('#container').toggleClass('aside-left-set')
  },

  'click [data-toggle=aside-right]': function() {
    $('#container').toggleClass('aside-right-set')
  },

  'click [data-toggle=notifications]': function() {
    $('#container').toggleClass('notifications-set')
  }
});

