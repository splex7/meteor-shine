Images = new Mongo.Collection('images');

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
/*
  cloudinaryUploadTag: function() {
    return CloudinaryServer.uploadTag();
  },
*/
	"cImageUploadSave" :function(attributes){
		check(attributes, Match.Any)

		var image = prepareData(attributes);

		image._id = Images.insert(image);

		return image._id;
	},

  "updateProfileId" : function(publicId, originUrl, userId) {
    Meteor.users.update(userId,
    {
      $set: {
          "profile.tempId": publicId,
          "profile.tempUrl": originUrl
      }
    });
  },

  "updateProfileUrl" : function(fetchedUrl, user) {
    Meteor.users.update(user._id,
      { $set:
        {
          "profile.avatarUrl": fetchedUrl,
          "profile.publicId": user.profile.tempId,
          "profile.tempUrl": "",
          "profile.tempId": ""
        }
      });
  }

});
