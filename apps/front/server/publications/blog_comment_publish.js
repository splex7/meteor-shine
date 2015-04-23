Meteor.publish('blogCommentsList', function(query, options) {

  Counts.publish(this, 'blogCommentsCount', BlogComments.find(query), { noReady: true });

  console.log('query = ' + JSON.stringify(query));

  var blogComments = BlogComments.find(query, options);

  var blogs = Blogs.find({ _id: query.blogId });

  return [ blogComments, blogs ];
});

