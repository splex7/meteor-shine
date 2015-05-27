Template.draftModal.helpers({
  draft: function () {
    return Drafts.find({'user._id': Meteor.userId()});
  }
});

Template.draftModal.events({
  'click li': function () {
    Session.set('currentDraft', this._id);
    $('#newTitle').html(this.title);
    $('#editor').html(this.content);
    $('#draftModal').modal('hide');
  }
});
