Template.profileEdit.helpers({

});

Template.profileEdit.events({

});



Template.profileEdit.onRendered(function() {
  $('.avatar-wrapper-custom > img').on('click', function() {
    $('#photoPicker').trigger('click');
    return false;
  });

  // When an image file is selected (or photo taken),
  // access the image file.
  $('#photoPicker').on('change', function(e) {

    e.preventDefault();

    if(this.files.length === 0) return;

    var imageFile = this.files[0];

    console.log('imageFile: ', imageFile);

    $('#profileModal').modal('show');

    var img = $('#avatarPreview')[0];

    // File API to read the image data
    // Create a file reader
    var reader = new FileReader();

    console.log('reader: ', reader);

    reader.onload = function(e)
    {
        img.src = e.target.result;

        /*console.log(img.src);*/

        // Configure a Canvas for the selected image dimensions
        var canvas = $("#photoEdit")[0];

        // Decide what size to scale the image to (if needed).
        var MAX_WIDTH = 1024;
        var MAX_HEIGHT = 768;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;


        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        //  Export the image on the Canvas as an image file
        var dataurl = canvas.toDataURL("image/png");

        img.src = dataurl;
    };

    // Load files into file reader
    reader.readAsDataURL(imageFile);

  });

  // set Cropperjs
  var $image = $('#avatarPreview'),
    cropBoxData,
    canvasData;
  // Listen modal's `show` and `hide` events
  $('#profileModal').on('shown.bs.modal', function () {

    // set Cropperjs's options
    $image.cropper({
      aspectRatio: 1 / 1,
      autoCropArea: 0.85,
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
    $image.cropper('destroy');
  });

  // upload profile photo to cloudinary server
  $('#saveBtn').on('click', function() {

  canvasData = $image.cropper('getData');
  var dataUrl = $('#avatarPreview')[0].src;

  console.log("canvasData: ", canvasData );
  console.log("dataUrl: ", dataUrl);


  $('#profileModal').modal('hide');

  Router.go('profileEdit');
  });


});
