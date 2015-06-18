Meteor.publish('draftsList', function (limit) {
  check(limit, Number);

  var drafts = Drafts.find({'user._id': this.userId}, {limit: limit});

  return drafts;
});

Meteor.publish('singleDraft', function (draftId) {
  check(draftId, String);

  var drafts = Drafts.find({_id: draftId, 'user._id': this.userId});

  return drafts;
})
