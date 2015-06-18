/**
 *
 *  TODO **HIGH PRIORITY**
 *
 *  Move Subscription to non-modal Template
 *  Modal Subscription is very buggy.
 *
 */

Template.draftModal.onCreated( function () {
  // Initialization
  var instance = this;

  // Initiate Reactive Variables
  instance.loaded = new ReactiveVar(0);
  instance.limit  = new ReactiveVar(5);

  // Autorun
  // will re-run when the "limit" reactive variables changes
  instance.autorun( function () {
    var limit = instance.limit.get();

    // Subscribe
    var subscription = instance.subscribe('draftsList', limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      instance.loaded.set(limit);
    } else {
      // Not Loaded Yet
    }
  });

  // Answer Limit Cursor
  instance.draftsList = function() {
    return Drafts.find({'user._id': Meteor.userId() }, {limit: instance.loaded.get()});
  }
});

Template.draftModal.helpers({
  draftsList: function () {
    return Template.instance().draftsList();
  },
  nextPath: function () {
    return Template.instance().draftsList().count() >= Template.instance().limit.get();
  }
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
  'click .load-more-drafts': function (event, template) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = Template.instance().limit.get();

    // increase limit by 5 and update it
    limit += 5;
    Template.instance().limit.set(limit);
  }
});
