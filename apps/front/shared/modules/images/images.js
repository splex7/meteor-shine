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
	"cImageUploadSave" :function(attributes){
		check(attributes, Match.Any)
		
		var image = prepareData(attributes);

		image._id = Images.insert(image);
	

		return image._id;
	}
})