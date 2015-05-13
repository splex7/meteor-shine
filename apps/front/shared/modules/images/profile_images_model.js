var imageStore = new FS.Store.GridFS("profile_temp",{path: "~/uploads"});

ProfileImages = new FS.Collection("profile_temp", {stores: [imageStore]});

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
  profileInsert: function(userId, profileRef){
    Meteor.users.update(userId, { $set: profileRef });
  },
  profileRemove: function(photoId){
    ProfileImages.remove(photoId);
  }
});
