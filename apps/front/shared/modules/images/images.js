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

  "uploadOriginImage" : function(publicId, originUrl, userId) {
    Meteor.users.update(userId,
    {
      $set: {
          "profile.tempId": publicId,
          "profile.tempUrl": originUrl
      }
    });
  },

  "updateProfileUrl" : function(originUrl, croppedUrl, publicId, canvasData) {
    Meteor.users.update(Meteor.userId(),
      { $set:
        { "profile.originUrl": originUrl,
          "profile.avatarUrl": croppedUrl,
          "profile.publicId": publicId,
          "profile.tempUrl": "",
          "profile.tempId": "",
          "profile.position": canvasData
        }
      });
  },

  'deleteTempUrl' : function() {
    Meteor.users.update(Meteor.userId(),
      { $set:
        {
          "profile.tempUrl": "",
          "profile.tempId": ""
        }
      });
  }

});
