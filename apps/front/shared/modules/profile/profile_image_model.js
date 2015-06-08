/**
 * ProfileImages
 *
 * @fileds
 *    _id              String                    PK
 *    url              String                    Cloudinary orginal url(http)
 *    surl             String                    Cloudinary orginal url(https)
 *    size             Int32                     image file size
 *    width            Int32                     image width
 *    height           Int32                     image height
 *    ext              String                    image file's extention
 *    mime             String                    data type
 *    original         String                    original image file name
 *    repoId           String                    image's public id for Cloudinary
 *    user             Object { _id, username }  owner
 *    createdAt        Date                      created time
 *
 * @type {Mongo.Collection}
 *
 */

ProfileImages = new Mongo.Collection('profileImages');

var prepareData = function(attributes) {
  var user = Meteor.user();

  return _.extend(_.pick(attributes, 'url', 'surl', 'size', 'width', 'height',
    'urlFit', 'surlFit', 'widthFit', 'heightFit',
    'ext', 'mime', 'original', 'repoId'), {
    user: {
      _id: user._id,
      username: user.username,
      //name: user.profile.name
    },
    createdAt: new Date()
  });
};

Meteor.methods({
  "profileImagesInsert" :function(attributes){
    check(attributes, Match.Any)

    var user = Meteor.user();

    var profileImage = prepareData(attributes);

    // insert new uploaded profile image into DB
    var profileImageId = ProfileImages.insert(profileImage);

    if(profileImageId) {
      // user profile picture temp field update
      var userProfileUpdateResult = Meteor.users.update(this.userId, {
        $set:
          {
            "profile.picture.temp": {
              _id: profileImageId,
              repoId: attributes.repoId,
              url: attributes.url,
            }
          }
      });

      if(userProfileUpdateResult) {
        console.log('profile image insert success! & user profile update success!');
        // if temporary profile info exists, remove it
        if(user.profile.picture.temp._id && user.profile.picture.temp.repoId) {
          console.log(ProfileImages.find(user.profile.picture.temp._id).fetch());
          console.log(ProfileImages.find(user.profile.picture.temp._repoId).fetch());
          // in db, temp img remove
          var result = ProfileImages.remove(user.profile.picture.temp._id);
          if(result === 1) {
            console.log('### Was temp DB img removed?  : success!');

            // in cloudinary, temp img remove
            var cloudRemoveResult = CloudinaryServer.removeProfileImages(user.profile.picture.temp.repoId);
            console.log('### Was temp Cloudinary img removed? : ', cloudRemoveResult);
            if(cloudRemoveResult) {
              return cloudRemoveResult
             } else return 'temp cloud remove failed'
          } else return 'temp db profile image remove failed'
        } else {
          console.log('There`s not temporary image');
          return true
        }
      } else {
        console.log('user profile update result : failed');
        return false
      }
    }
    console.log('### DB ProfileImages insert failed');
    return false
  },

  temporaryProfileReset: function() {
    var result = Meteor.users.update( this.userId, {$set: {
            'profile.picture.temp': {}
      }
    });
    return result
  },

  // profileImagesUpdate: function() {

  // },
  // prifileImagesRemove: function() {

  // }
});

