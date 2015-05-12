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
  waitOn: function () {
    return Meteor.subscribe('profileImage');
    }
  // controller: 'ProfileController'
});

Router.route('/profile/pic', {
  name: 'profilePicDialogs',
  // controller: 'ProfileController'
});
