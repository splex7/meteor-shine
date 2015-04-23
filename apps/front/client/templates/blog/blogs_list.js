var triggerHandle;

Template.blogsList.onRendered(function() {
  triggerHandle = InfiniteScrollTrigger.bind(function() {
    if (Router.current().nextPath())
      Router.go(Router.current().nextPath());
  });
});

Template.blogsList.onDestroyed(function() {
  if (triggerHandle)
    InfiniteScrollTrigger.unbind(triggerHandle);
});

Template.blogsList.helpers({
  noBlogs: function() {
    return Counts.get('blogsCount') === 0;
  }
});
