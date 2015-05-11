ProfileController = RouteController.extend({

  // subscriptions: function() {
  //   this.subs = Meteor.subscribe('profile');
  // },

  // data: function() {
  //   return {

  //   }
  // }

});

Router.route('/profile/view', {
  name: 'profileView',
  // controller: 'ProfileController'
});

Router.route('/profile/edit', {
  name: 'profileEdit',
  // controller: 'ProfileController'
});

Router.route('/profile/pic', {
  name: 'profilePicDialogs',
  // controller: 'ProfileController'
});

