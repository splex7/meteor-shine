Meteor.publishComposite('blogCommentsList', function(query, options) {

  Counts.publish(this, 'blogCommentsCount', BlogComments.find(query),
  { noReady: true });

  return {
    find: function() {
      // Find comments made by user. Note arguments for callback function
      // being used in query.
      return BlogComments.find(query, options);
    },
    children: [
      // This section will be similar to that of the previous example.
      {
        find: function(comment) {
          // Find commenter. Even though we only want to return
          // one record here, we use "find" instead of "findOne"
          // since this function should return a cursor.
          return Meteor.users.find(
            { _id: comment.user._id },
            { limit: 1, fields: { username: 1, profile: 1 } });
        }
      }
    ]
  }
});
