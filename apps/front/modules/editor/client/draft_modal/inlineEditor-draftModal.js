
Template.draftModal.helpers({
  drafts: function () {
    var userId = Meteor.userId();
    var draft = Drafts.find({'user._id': userId });

    if (userId && draft) {
      return draft;
    }
  },
  draftCount: function () {
    var userId = Meteor.userId();
    var draft = Drafts.find({'user._id': userId });

    if (userId && draft) {
      return draft.count();
    }
  },
  nextPath: function () {
    var draftCursor = Number(Session.get('draftsLimit'));
    return draftCursor === Drafts.find({'user._id': Meteor.userId()}, {limit: draftCursor}).count();
  },
});

Template.draftModal.events({
  'click li p': function () {
    Session.set('currentDraft', this._id);
    $('#newTitle').html(this.title);
    $('#editor').html(this.content);
    $('#draftModal').modal('hide');
    console.log('Draft: "' + this.title + '" loaded');
  },
  'click .btn-danger': function () {
    console.log(this._id);
    Meteor.call('draftRemove', this._id, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        // Clear Session if current session is deleted session.
        if (Session.get('currentDraft') === this._id) {
          Session.set('currentDraft', null);
        }
        console.log('Success');
      }
    });
  },
  'click a.load-more-draft': function (event) {
    event.preventDefault();

    Session.set('draftsLimit', Number(Session.get('draftsLimit')) + 5)
  }
});
