Router.route('/profile',{
 waitOn: function () {
   return Meteor.subscribe('profile_temp')
 },
 action: function () {
   if (this.ready())
    /*this.render('Profile');*/
    $('#profileModal').modal('show');
   else
    this.render('Loading');
   }
});
