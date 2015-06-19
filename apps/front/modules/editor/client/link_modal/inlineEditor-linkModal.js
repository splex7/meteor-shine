Template.linkModal.events({

  'click button.add-link': function (event, template) {
    // Last Cursor Selection
    //var savedSel = Session.get('savedSel');

    // Restore Cursor Position before Insert
    restoreSelection(blurSavedSel);

    // Add Link
    var url = $.trim('input.add-link').val();

    // Add Here
    // If link does provide http:// or https:// or such
    // Add as such
    //
    // If not, add http:// before url

    // Test the Above Link for http:// https://
    var regEx = new RegExp("^(http|https)://", "i");

    if (regEx.test(url)) {
        document.execCommand("CreateLink", false, url + " ");
    } else {
        document.execCommand("CreateLink", false, 'http://' + url + " ");
    }

    $('input.add-link').val('');
    $('#linkModal').modal('hide');
  }

});
