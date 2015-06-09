var cloudinary = Npm.require('cloudinary');
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

/**
 * cloudinary configuration
 */
cloudinary.config({
  cloud_name: Meteor.settings.public.cloudinary.cloudName,
  api_key: Meteor.settings.public.cloudinary.apiKey,
  api_secret: Meteor.settings.cloudinary.apiSecret,
});

var cloudinary_cors = Meteor.absoluteUrl('upload/cloudinary_cors.html');

Meteor.methods({
  cloudinaryUploadTag: function(elementId, options) {
    options = _.extend(options, { callback: cloudinary_cors })
    return cloudinary.uploader.image_upload_tag(elementId, options);
  },
  // http://cloudinary.com/documentation/node_image_upload
  removeImage: function(imageId) {
    var future = new Future();

    cloudinary.uploader.destroy(imageId, function(result) {
      future.return(result);
    });

    return future.wait();
  },

  updateCroppedImage: function(profileObj, flag) {
    // cropped image uploaded into cloudinary
    var croppedUrl = CloudinaryServer.updateProfileImages(profileObj);
    console.log('cropped image url: ', croppedUrl);

    //http://res.cloudinary.com/meteor-shine/image/upload/c_crop,h_239,w_239,x_249,y_157/v1/accounts/shlfujafszezsfkqcyis

    // if cropping success
    if(croppedUrl) {

      var userUpdate = Meteor.users.update( this.userId, { $set: { 'profile.picture.origin.urlCropped': croppedUrl }});
      if (userUpdate === 1) console.log('temporary cloudinary image remove!')

      var tempProfileDoc = ProfileImages.find({'user._id':this.userId, _id: {$ne: profileObj._id}}).fetch();
      console.log('temporary ProfileImages doc count :',tempProfileDoc.length);

      if(tempProfileDoc.length > 0) {
        for(var i = 0; i < tempProfileDoc.length; i++) {
          console.log('index: ', i);
          console.log('tempProfileDoc[i]._id : ', tempProfileDoc[i]._id);
          console.log('tempProfileDoc[i].repoId : ', tempProfileDoc[i].repoId);
          var imageId = tempProfileDoc[i].repoId;

          var dbRemove = ProfileImages.remove(tempProfileDoc[i]._id);
          if (dbRemove === 1) console.log('temporary ProfileImages doc remove!');


          if (dbRemove === 1) {
            var cloudRemove = CloudinaryServer.removeProfileImages(imageId);
            console.log('cloud remove: ', cloudRemove);
          }
        }
      }


      // user profile picture update
      var dbUpdateResult = Meteor.users.update( this.userId, {$set: {
        'profile.picture.origin._id': profileObj._id,
        'profile.picture.origin.repoId': profileObj.repoId,
        'profile.picture.origin.url': profileObj.url,
        // 'profile.picture.origin.urlCropped': croppedUrl,
        'profile.picture.coordinates.left': profileObj.canvasData.left,
        'profile.picture.coordinates.top': profileObj.canvasData.top,
        'profile.picture.coordinates.width': profileObj.canvasData.width,
        'profile.picture.coordinates.height': profileObj.canvasData.height,
        'profile.picture.coordinates.rotate': profileObj.canvasData.rotate
      }});

      if(dbUpdateResult === 1) {
        console.log('DB user profile update success!');
      }
      return croppedUrl
    }

    return 'update failed!';
  }
});


CloudinaryServer = {
  removeProfileImages: function(imageId) {
    var future = new Future();

    // cloudinary.url(public_id, callback, options);
    cloudinary.uploader.destroy(imageId, function(result) {
      future.return(result);
    });

    return future.wait();
  },
  updateProfileImages: function(profileObj) {
    // API : cloudinary.url(public_id, options);
    // return : image url
    return cloudinary.url( profileObj.repoId,
      {
        transformation: {
          crop: 'crop',
          width: profileObj.cropData.width,
          height: profileObj.cropData.height,
          x: profileObj.cropData.x,
          y: profileObj.cropData.y
        },
        angle: profileObj.cropData.rotate
      }
    );
  },

};
