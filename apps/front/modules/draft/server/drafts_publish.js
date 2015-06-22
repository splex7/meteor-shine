Meteor.publish('draftsList', function (options) {
  check(options, {
      limit: Number,
      sort: Object
  });

  Counts.publish(this, 'draftCount',
    Drafts.find({'user._id': this.userId}),
    { noReady: true });

  var drafts = Drafts.find({'user._id': this.userId}, options);

  return drafts;
});
