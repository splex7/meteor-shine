var imageStore = new FS.Store.GridFS("profile_temp");

ProfileImages = new FS.Collection("profile_temp", {
 stores: [imageStore]
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
