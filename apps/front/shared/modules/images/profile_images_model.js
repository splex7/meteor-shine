ProfileImages = new FS.Collection("profile_thumbs", {
    stores: [
      /*new FS.Store.GridFS("profile", {path: "~/uploads"}),*/
      new FS.Store.FileSystem("profile_thumbs", {
        transformWrite: function(fileObj, readStream, writeStream) {
          // Transform the image into a 10x10px thumbnail
          gm(readStream, fileObj.name()).resize('300', '300').stream().pipe(writeStream);
        }
      })
    ],
    filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

ProfileImages.allow({
 insert: function(){
   return true;
 },
 update: function(){
   return true;
 },
 remove: function(){
   return true;
 },
 download: function(){
   return true;
 }
});

ProfileImages.deny({
 insert: function(){
   return false;
 },
 update: function(){
   return false;
 },
 remove: function(){
   return false;
 },
 download: function(){
   return false;
 }
});

Meteor.methods({
  profileInsert: function(userId, profileRef) {
    Meteor.users.update(userId, { $set: profileRef });
  },
  profileRemove: function(photoId) {
    ProfileImages.remove(photoId);
  },
  profileUpdate: function(user, cropBoxData) {

    console.log("cropBoxData: ", cropBoxData);

    console.log("user: ", user);

    var thumbnailFileObj = ProfileImages.findOne({_id: user.profile.reference._id });

    console.log("thumbnailFileObj: ", thumbnailFileObj);

    // Cloudinary Upload Image
    cloudinaryDirectUpload(

      {

        cloud_name: Meteor.settings.public.cloudinary.cloudName,

        preset: Meteor.settings.public.cloudinary.presets.profile,

        progress_bar_selecter: '.progress-wrapper'

      },

      {
        multiple: true
      },


      function(e, thumbnailFileObj) {

        console.log("e", e);
        console.log("data", thumbnailFileObj);

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

          var source = '<div class="avatar-wrapper-custom"><img class="img-responsive" src="' + imageUrlFit(attributes) + '" data-id="' + id + '" /></div>';

          $('.avatar-wrapper-custom').replaceWith(source);

          console.log(source);
          console.log('upload done');
        });

      }


    );// end Cloudinary Upload Image

  }
});
