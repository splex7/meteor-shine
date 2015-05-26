ProfileController = RouteController.extend({

});


Router.route('/profile/view', {
  name: 'profileView',
  controller: 'ProfileController'
});

Router.route('/profile/edit', {
  name: 'profileEdit',
  controller: 'ProfileController'
});

