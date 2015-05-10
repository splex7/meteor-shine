Template.layout.events({
	'click #main-overlay': function () {
    console.log('Hello!');
    $('#container').removeClass('aside-left-set')
  }
});

Template.layout.onRendered( function () {
  $(window).on( 'resize', function () {
    if ($(window).width() <= 750) {
       $('#container').addClass('mobile');
    } else {
      $('#container').removeClass('mobile');
    };
  });
});

