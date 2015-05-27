Template.headerDefault.helpers({
  notificationsCount: function() {
    return Counts.get('notificationsUnreadCount');
  }
});


Template.headerDefault.events({
  'click [data-toggle=aside-left]': function() {
    $('#wrapper').toggleClass('aside-left-set');
    alert("test");
  },

  'click [data-toggle=aside-right]': function() {
    $('#wrapper').toggleClass('aside-right-set');
  },

  'click [data-toggle=notifications]': function() {
    $('#wrapper').toggleClass('notifications-set');
  }
});

