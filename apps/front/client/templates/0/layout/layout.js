Template.layoutDefault.events({
	'click #main-overlay': function() {
    	console.log('Hello!');
    	$('#container').removeClass('aside-left-set')
  	}
});