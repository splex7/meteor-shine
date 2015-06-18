Meteor.publish('Drafts', function() {
  var drafts = Drafts.find({'user._id': this.userId });

  return drafts;
});
