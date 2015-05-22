Template.layout.events({
	'click #main-overlay': function () {
    console.log('Hello!');
    $('#container').removeClass('aside-left-set')
  }
});

Template.layout.onRendered( function () {

  var wrapper = $('#wrapper');

  // Check Mobile Mode when rendered
  if ($(window).width() <= 750) {
    wrapper.addClass('mobile');
  } else {
    wrapper.removeClass('mobile');
  };

  // Check Mobile Mode on resize
  $(window).on( 'resize', function () {
    if ($(window).width() <= 750) {

      wrapper.addClass('mobile');
      if (wrapper.hasClass('aside-left-set')) {
        wrapper.removeClass('aside-left-set');
      } else {

      }
    } else if ($(window).width() > 750) {
      wrapper.removeClass('aside-left-set');
    } else {
      wrapper.removeClass('mobile');
    };
  });

});

