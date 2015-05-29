
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    Meteor.subscribe("userStatus");

    return (Meteor.userId()) ? [ Meteor.subscribe('notificationsList') ] : [];
  }
});

var accessControl = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
  } else {
    this.next();
  }
};

Router.onBeforeAction(accessControl, { only: [
  'myBlogsList',
  'myBlogOne',
  'blogNew',
  'blogEdit'
]});

Router.route('/', function() {
  this.redirect('/home');
});
