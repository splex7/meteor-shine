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
    // 클라우디네리 크롭된 이미지 업데이트
    var croppedUrl = CloudinaryServer.updateProfileImages(profileObj);
    // console.log('result - cropped url: ', croppedUrl);
    //http://res.cloudinary.com/meteor-shine/image/upload/c_crop,h_239,w_239,x_249,y_157/v1/accounts/shlfujafszezsfkqcyis

    // 크롭 성공
    if(croppedUrl) {

      console.log('user._id : ', this.userId);
      console.log('profile object _id : ', profileObj._id);

      var tempProfileDoc = ProfileImages.find({'user._id':this.userId, _id: {$ne: profileObj._id}}).fetch();
      console.log('temporary profile images count :',tempProfileDoc.length);
      console.log('temporary profile images count :',tempProfileDoc);

      if(tempProfileDoc.length > 0) {
        for(var i = 0; i < tempProfileDoc.length; i++) {

          console.log('tempProfileDoc[i]._id : ', tempProfileDoc[i]._id);
          console.log('tempProfileDoc[i].repoId : ', tempProfileDoc[i].repoId);
          var imageId = tempProfileDoc[i].repoId;

          console.log('i: ', i);

          var dbRemove = ProfileImages.remove(tempProfileDoc[i]._id);
          console.log('dbRemove : ', dbRemove);

          if (dbRemove === 1) {
            var cloudRemove = CloudinaryServer.removeProfileImages(imageId);
            console.log('cloudRemove: ', cloudRemove);
          }
        }
      }


      // user profile picture 정보 업데이트
      var dbUpdateResult = Meteor.users.update( this.userId, {$set: {
        'profile.picture._id': profileObj._id,
        'profile.picture.repoId': profileObj.repoId,
        'profile.picture.url': profileObj.url,
        'profile.picture.urlCropped': croppedUrl,
        'profile.picture.temp': {},
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
