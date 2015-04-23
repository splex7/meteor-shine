Meteor.publish('blogsList', function(query, options) {

  Counts.publish(this, 'blogsCount', Blogs.find(), { noReady: true });

  var blogs = Blogs.find(query, options);

  return blogs;
});


Meteor.publish('blogOne', function(blogId) {
  var blogs = Blogs.find({ _id: blogId });

  return blogs;
});


Meteor.publish('myBlogsList', function(query, options) {
  query = _.extend(query, { 'user._id': this.userId });

  Counts.publish(this, 'blogsCount', Blogs.find(query), { noReady: true });

  var blogs = Blogs.find(query, options);

  return blogs;
});


Meteor.publish('myBlogOne', function(blogId) {
  var blogs = Blogs.find({ _id: blogId, 'user._id': this.userId });

  return blogs;
});
