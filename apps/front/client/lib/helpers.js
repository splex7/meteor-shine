Template.registerHelper('activeRoute', function(/* route names */) {
	var args = Array.prototype.slice.call(arguments, 0);
	args.pop();

	var active = _.any(args, function(name) {
		return Router.current() && Router.current().route.getName() === name
	});

	return active && 'active';
});

Template.registerHelper('getAvatarUrl', function () {
  // var newSrc = Meteor.user().profile;
  // if(newSrc) {
  //   return newSrc.url;
  // }
  // return '/images/default_profile.png';
  var user  = Meteor.user();

  if (user && user.profile) {
    return user.profile.avatarUrl;
  }
});