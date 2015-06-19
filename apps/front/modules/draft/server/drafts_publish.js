Meteor.publish('draftsList', function (options) {
  check(options, {
      limit: Number
  });

  var drafts = Drafts.find({'user._id': this.userId}, options);

  return drafts;
});
