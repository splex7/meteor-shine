//Router.route('/blog/:blogId/comments', {
//  name: 'blogCommentsList'
//});
//BlogCommentsListController = RouteController.extend({
//  increment: DEFAULT_LIST_INCREMENT,
//  limit: function() {
//    return parseInt(this.params.query.r) || this.increment;
//  },
//  nextPath: function() {
//    this.params.query.r = this.limit() + this.increment;
//    return this.route.path({}, { query: this.params.query });
//  },
//
//  findQuery: function() {
//    return { blogId: this.params.blogId }
//  },
//  findOptions: function() {
//    return { limit: this.limit(), sort: { createdAt: -1 }}
//  },
//
//  blogComments: function() {
//    return BlogComments.find(this.findQuery(), this.findOptions());
//  },
//  subscriptions: function() {
//    this.subs = Meteor.subscribe('blogCommentsList', this.findQuery(), this.findOptions());
//  },
//
//  data: function() {
//    return {
//      ready: this.subs.ready,
//      hasMore: this.blogComments().count() === this.limit(),
//      blogComments: this.blogComments().fetch()
//    };
//  }
//
//});
