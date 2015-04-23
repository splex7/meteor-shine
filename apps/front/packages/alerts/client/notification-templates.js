Template.meteorAlerts.helpers({
  alerts: function() {
    return Alerts.collection.find({ template: 'window' });
  }
});

Template.meteorAlert.onRendered(function() {
  var alert = this.data;
  if (alert.duration > 0) {
    Meteor.setTimeout(function () {
      Alerts.collection.remove(alert._id);
    }, alert.duration);
  }
});

var style = {
  error: {
    clas: 'alert-danger',
    icon: 'fa-minus-circle'
  },
  info: {
    clas: 'alert-info',
    icon: 'fa-exclamation-circle'
  },
  warning: {
    clas: 'alert-warning',
    icon: 'fa-exclamation-triangle'
  },
  success: {
    clas: 'alert-success',
    icon: 'fa-thumbs-o-up'
  }
};

Template.meteorAlert.helpers({
  alertClass: function() {
    return style[this.type].clas;
  },
  alertIcon: function() {
    return style[this.type].icon;
  }
});

Template.meteorAlert.events({
  'click .close': function() {
    Alerts.collection.remove(this._id);
  }
});


