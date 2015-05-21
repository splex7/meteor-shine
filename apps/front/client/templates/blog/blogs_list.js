//var triggerHandle;

// Template.blogsList.onRendered(function() {
//   triggerHandle = InfiniteScrollTrigger.bind(function() {
//     if (Router.current().nextPath())
//       Router.go(Router.current().nextPath());
//   });
// });

// Template.blogsList.onDestroyed(function() {
//   if (triggerHandle)
//     InfiniteScrollTrigger.unbind(triggerHandle);
// });

Template.blogsList.events({
  'click .load-more': function () {
    Router.go(Router.current().nextPath());
  }
});


Template.blogsList.helpers({
  noBlogs: function() {
    return Counts.get('blogsCount') === 0;
  }
});

Template.blogsListItem.helpers({
  blog_content: function() {
    var content = this.content;
    //return content.replace(/<(?:.|\n)*?>/gm, '');
    //return content.replace(/(<([^>]+)>)/ig, "");
    return content;
  }
});
