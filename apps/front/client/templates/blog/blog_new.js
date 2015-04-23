Template.blogNew.helpers({
  editable: function() {
    return '<div class="editable form-control" contenteditable="true" name="content"></div>';
  }
});

Template.blogNew.events({
  'submit #formBlogNew': function(e) {
    e.preventDefault();

    // get inputs
    var object = {
      title: $(e.target).find('[name=title]').val(),
      content: $(e.target).find('[name=content]').html()
    };

    // validate inputs
    /*
    var validation = BlogValidator.validateInsert(object);
    if (! _.isEmpty(validation.errors())) {
      showValidationErrors(e, validation.errors());
      return;
    }
    */

    // method call 'blogInsert'
    Meteor.call('blogInsert', object, function(error, result) {
      if (error) {
        alert(error.reason);
      } else {
        alert('insert success');
        Router.go('myBlogsList');
      }
    });

  }
});
