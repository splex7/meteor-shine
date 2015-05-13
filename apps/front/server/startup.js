/**
 * Server startup
 */
Meteor.startup(function() {

  // CollectionFS debug mode for logging
  FS.debug = true;

  ProfileImages.remove({});

  if (Preference.find().count() === 0) {
    Preference.insert({
      _id: 'theme', value: 'classic'
    });
  }

});
