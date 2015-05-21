
Template.profileEdit.helpers({
});

Template.profileEdit.events({
});

Template.profileEdit.onRendered(function() {
  // click user profile image, so show pop up window for selecting an image
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

    // console.log('imageFile: ', imageFile);

    $('#profileModal').modal('show');

    // this is modal's img element
    var img = $('#avatarPreview')[0];

    // File API to read the image data
    // Create a file reader
    var reader = new FileReader();

    console.log('File reader for HTML5 preview: ', reader);

    reader.onload = function(e)
    {
        // set the original image data url to image src attribute
        img.src = e.target.result;
        console.log('Original image info: ',img.src);

        // Configure a Canvas for the selected image dimensions
        var canvas = $("#photoEdit")[0];

        // Decide what size to scale the image to (if needed).
        // Apple iOS image 10MB limit
        var MAX_WIDTH = 1136;
        var MAX_HEIGHT = 640;
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

        // Export the image on the Canvas as an image file
        // Setting image original quality with png extension
        var dataurl = canvas.toDataURL("image/png", 1);

        // set the scaled image data url to image src attribute
        img.src = dataurl;

        console.log('Scaled image info: ',img.src);
    };
    // Load files into file reader
    reader.readAsDataURL(imageFile);
  }); // end `change` event listener

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

  // code here for upload profile photo to cloudinary server
  // using jquery file upload & cloudinary
  $('#saveBtn').on('click', function() {
    canvasData = $image.cropper('getCanvasData');

    var dataSrc = $('#avatarPreview')[0].src;

    Cloudinary.uploadImageDataURI({
      config: {
        cloud_name: Meteor.settings.public.cloudinary.cloudName,
        api_key: Meteor.settings.public.cloudinary.apiKey
      },
      buttonHTML: '<i class="fa fa-upload">',
      showProgress: true,
      options: {
        multiple: true
      },
      addons: {
        eager: { crop: "crop", x: 0, y: 0, width: 150, height: 150 }
      },
      data: dataSrc
    }, function(e, data) {
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
      Meteor.call('cImageUploadSave', attributes, function(error, id) {
        if (error) {
          //Alerts.error(error.reason);
          console.log(error.reason)
        }

        attributes._id = id;

        var source = '<p class="image"><img class="img-responsive" src="' + imageUrlFit(attributes) + '" data-id="' + id + '" /></p>';

        $('#editor .is-selected').after(source);

        console.log('upload done');
      });

    });

    // canvas Data to be sent to Cloudinary with dataURL
    console.log("canvas data: ", canvasData );

    $('#profileModal').modal('hide');
    Router.go('profileEdit');
  });
});
