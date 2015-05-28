ProfileController = RouteController.extend({

});


Router.route('/profile/view', {
  name: 'profileView',
  // controller: 'ProfileController'
});

Router.route('/profile/edit', {
  name: 'profileEdit',
  waitOn: function () {
    Meteor.subscribe('profileEdit');
  }
  // controller: 'ProfileController'
});

