var triggerHandle;

Template.myBlogsList.onRendered(function() {
  triggerHandle = InfiniteScrollTrigger.bind(function() {
    if (Router.current().nextPath())
      Router.go(Router.current().nextPath());
  });
});

Template.myBlogsList.onDestroyed(function() {
  if (triggerHandle)
    InfiniteScrollTrigger.unbind(triggerHandle);
});


Template.myBlogsList.helpers({
  noBlogs: function() {
    return Counts.get('blogsCount') === 0;
  }
});
