Template.layout.events({
	'click #main-overlay': function () {
    console.log('Hello!');
    $('#container').removeClass('aside-left-set')
  }
});

Template.layout.onRendered( function () {

  // Check Mobile Mode when rendered
  if ($(window).width() <= 750) {
     $('#container').addClass('mobile');
  } else {
    $('#container').removeClass('mobile');
  };

  // Check Mobile Mode on resize
  $(window).on( 'resize', function () {
    if ($(window).width() <= 750) {
      $('#container').addClass('mobile');
      $('#container').removeClass('aside-left-set');
    } else if ($(window).width() > 750) {
      $('#container').removeClass('aside-left-set');
    } else {
      $('#container').removeClass('mobile');
    };
  });
});

