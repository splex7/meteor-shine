/**
 * Server startup
 */
Meteor.startup(function() {
  if (Preference.find().count() === 0) {
    Preference.insert({
      _id: 'theme', value: 'classic'
    });
  }
});
