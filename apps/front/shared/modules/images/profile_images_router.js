Router.route('/profile/view', {
  name: 'profileView',
});

Router.route('/profile/edit', {
  name: 'profileEdit',
  waitOn: function () {
    return Meteor.subscribe('profileImage');
    }
});
