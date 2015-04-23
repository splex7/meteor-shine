/**
 * controls menu navigation UI
 */

Template.treeMenu.events({
  'click .menu-item': function(e) {
    e.preventDefault();

    var template = Template.instance();

    if ($(e.target).attr('data-toggle') === 'collapse') {
      template.$('.collapse.in').collapse('hide');
    } else {
      template.$('.active').removeClass('active');
      $(e.target).addClass('active');

      var url;
      if ($(e.target).hasClass('menu-item-main')) {
        template.$('.collapse.in').collapse('hide');
        url = $(e.target).attr('href');
      } else {
        $(e.target).parent().prev().addClass('active');
        url = $(e.target).attr('data-link');
      }

      if (url)
        Router.go(url);
    }
  }
});
