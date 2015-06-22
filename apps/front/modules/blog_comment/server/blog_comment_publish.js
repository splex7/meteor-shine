Meteor.publishComposite('blogCommentsList', function(query, options) {

  Counts.publish(this, 'blogCommentsCount', BlogComments.find(query),
  { noReady: true });

  return {
    find: function() {
      return BlogComments.find(query, options);
    },
    children: [
      {
        find: function(blogComment) {
          return Meteor.users.find(
            { _id: blogComment.user._id },
            { fields: { username: 1, profile: 1 } });
        }
      }
    ]
  }
});
