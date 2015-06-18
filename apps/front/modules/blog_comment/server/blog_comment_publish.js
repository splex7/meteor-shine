Meteor.publish('blogCommentsList', function(query, options) {

  //Meteor._sleepForMs(2000);

  Counts.publish(this, 'blogCommentsCount', BlogComments.find(query),
    { noReady: true });

  var blogComments = BlogComments.find(query, options);

  var blogs = Blogs.find({ _id: query.blogId });

  return [ blogComments, blogs ];
});

