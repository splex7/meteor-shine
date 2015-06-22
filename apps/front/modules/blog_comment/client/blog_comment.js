Template.blogCommentNew.helpers({
  editable: function() {
    return '<div class="editable form-control" contenteditable="true" name="msg"></div>';
  }

});

Template.blogCommentNew.events({
  'submit #formBlogCommentNew': function(e) {
    e.preventDefault();

    var blogId = Template.parentData().blog._id;

    var object = {
      blogId: blogId,
      msg: $(e.target).find('[name=msg]').html().trim()
    };

    Meteor.call('blogCommentInsert', object, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        $(e.target).find('[name=msg]').html('');

        var frame = $('.comments-list-frame');
        frame.animate({ scrollTop: frame[0].scrollHeight }, "slow");
      }
    });
  }
});

Template.blogComments.onCreated(function() {

  var instance = this;
  var blogId = Template.parentData(1).blog._id;

  instance.loaded = new ReactiveVar(0);
  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.scrollPos = 0;

  instance.autorun(function() {
    instance.subscription = instance.subscribe('blogCommentsList',
      { blogId: blogId },
      { limit: instance.limit.get(), sort: { createdAt: -1 }});
  });

  instance.autorun(function() {
    if (instance.subscription.ready()) {
      instance.loaded.set(instance.limit.get());
    }
  });

  instance.comments = function() {
    var comments = BlogComments.find({ blogId: blogId },
      { limit: instance.loaded.get(), sort: { createdAt: 1 }});
    console.log('comments returned...');
    return comments;
  };
});

Template.blogComments.onRendered(function() {
  this.frame = $('.comments-list-frame');

  this.frame.animate({ scrollTop: this.frame[0].scrollHeight }, "slow");
});

Template.blogComments.onDestroyed(function() {
});

Template.blogComments.helpers({
  blogCommentsCount: function() {
    return Counts.get('blogCommentsCount');
  },

  blogComments: function() {
    return Template.instance().comments();
  },

  hasMore: function() {
    var total = Counts.get('blogCommentsCount');
    return (total > Template.instance().limit.get());
  }
});
Template.blogComments.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();

    var limit = instance.limit.get();
    instance.limit.set(limit + instance.increment);
    console.log('queryLimit = ' + instance.limit.get());
  }
});

Template.blogCommentsListItem.helpers({
  commenter: function() {
    return Meteor.users.findOne(this.user._id);
  }
});
