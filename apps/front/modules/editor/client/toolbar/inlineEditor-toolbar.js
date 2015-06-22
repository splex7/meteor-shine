
Template.inlineEditorToolbar.events({
  'click .btn-bold': function (event, template) {
    document.execCommand('bold', false, true);
  },
  'click .btn-italic': function (event, template) {
    document.execCommand('italic', false, true);
  }
});
