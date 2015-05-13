Template.profileEdit.helpers({
  profileImage: function () {
    // current user object return
    var user = Meteor.user();

    if (user.profile) {
      return ProfileImages.findOne(user.profile.reference._id, {});
    } else{
      return false;
    }
  }
});

// http://fengyuanchen.github.io/cropper/
// https://github.com/jonblum/meteor-cropper/
Template.profileEdit.events({
  'click .avatar-wrapper-custom > img' : function() {
    $('.myFileInput').trigger('click');
  },

  'change .myFileInput': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      ProfileImages.insert(file, function (err, fileObj) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if (err){
          // handle error
          console.log("File upload error: ", err);
        } else {
          // handle success

          // get current user's _id
          var userId = Meteor.userId();

          // align object for file obj reference in users collection
          var profileRef = { 'profile.reference': fileObj };

          Meteor.call('profileInsert', userId, profileRef);

          $('#profileModal').modal('show');
        }
      });
    });
  }


  //'change .myFileInput': function(event, template) {

  //      FS.Utility.eachFile(event, function(file) {

  //        ProfileImages.insert(file, function (err, fileObj) {
  //          if (err){
               // handle error
  //             alert(err);
  //          } else {

               // handle success depending what you need to do
  //               var userId = Meteor.userId();
  //            var imagesURL = {
  //              'profile.image': '/cfs/files/images/' + fileObj._id
  //            };
  //            Meteor.users.update(userId, {$set: imagesURL});
  //          }
  //
  //          $('#profileModal').modal('show');
  //        });
  //     });
  //   },


});

Template.profileEdit.onRendered(function() {

  var $image = $('.avatar-wrapper > img'),
    cropBoxData,
    canvasData;

  $('#profileModal').on('shown.bs.modal', function () {
    $image.cropper({
      aspectRatio: 1 / 1,
      autoCropArea: 1.2,
      strict: false,
      guides: false,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      preview: '.avatar-preview',
      built: function () {
        // Strict mode: set crop box data first
        $image.cropper('setCropBoxData', cropBoxData);
        $image.cropper('setCanvasData', canvasData);
      }
    });
  }).on('hidden.bs.modal', function () {
    cropBoxData = $image.cropper('getCropBoxData');
    canvasData = $image.cropper('getCanvasData');

    // Object {left: 86.15, top: 59.150000000000006, width: 245.7, height: 245.7}
    // Later, This values will be used by server or canvas to 
    // crop the image.
    console.log("cropBoxData: ", cropBoxData);
    console.log("canvasData: ", canvasData);
    $image.cropper('destroy');
  });



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
