Template.profileEdit.helpers({




});

// http://fengyuanchen.github.io/cropper/
// https://github.com/jonblum/meteor-cropper/
Template.profileEdit.events({
  'click .profile-pic-modal' : function(e) {

    e.preventDefault();

    $('#profileModal').modal('show');

  },

  /*'click #avatarInput' : function() {
    $('#avatarInput').trigger('click');

    console.log(this);

    return false;
  },*/

});

Template.profileEdit.onRendered(function() {

  $('#PhotoPicker').on('change', function(e) {
    e.preventDefault();
    if(this.files.length === 0) return;
    var imageFile = this.files[0];
    console.log(imageFile);

  });



  var myImg = $('#cropper-example-2 > img').attr('src');
  console.log("myImg:", myImg);
  Session.set('myImg', myImg);






  // Cloudinary Upload Image
  cloudinaryDirectUpload(
    {

      cloud_name: Meteor.settings.public.cloudinary.cloudName,

      preset: Meteor.settings.public.cloudinary.presets.test,

      progress_bar_selecter: '.progress-wrapper'

    },
    {
      multiple: true
    },
    function(e, data) {
      console.log("e", e);
      console.log("data", data);
      var attributes = {
        // genreId: instance.data.chapter.genreId,
        // bookId: instance.data.chapter.bookId,
        // chapterId: instance.data.chapter._id,
        url: data.result.url,
        surl: data.result.secure_url,
        size: data.result.bytes,
        width: data.result.width,
        height: data.result.height,
        urlFit: data.result.eager[0].url,
        surlFit: data.result.eager[0].secure_url,
        widthFit: data.result.eager[0].width,
        heightFit: data.result.eager[0].height,
        ext: data.result.format,
        mime: data.originalFiles[0].type,
        original: data.originalFiles[0].name,
        repoId: data.result.public_id
      };
    Meteor.call('cImageUploadSaveForAccounts', attributes, function(error, id) {
        if (error) {
          //Alerts.error(error.reason);
          console.log(error.reason)
        }

        attributes._id = id;

        var source = '<p class="image"><img class="img-responsive" src="' + imageUrlFit(attributes) + '" data-id="' + id + '" /></p>';

        $('.avatar').replaceWith(source);

        console.log(source);
        console.log('upload done');
      });
    }
  );// end Cloudinary Upload Image

});
