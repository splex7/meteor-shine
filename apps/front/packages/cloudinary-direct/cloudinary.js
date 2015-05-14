
Cloudinary = {
  uploadSelector: '.cloudinary-fileupload',

  buttonHtml: 'upload...',

  uploadImage: function(settings, options) {
  },

  uploadImagePreset: function(options, callback) {
    if (options.buttonHtml) {
      this.buttonHtml = options.buttonHtml;
    }

    $(this.uploadSelector).unsigned_cloudinary_upload(
      options.preset,
      { cloud_name: options.cloudName },
      options.options
    ).on('cloudinarystart', function() {
        if (options.progress && options.progress.enable)
          $(options.progress.window).show();
      }).on('cloudinarydone', function(e, data) {
        if (options.progress && options.progress.enable)
          $(options.progress.window).hide();
        callback(e, data);
      }).on('cloudinaryprogress', function(e, data) {
        if (options.progress && options.progress.enable) {
          $(options.progress.bar).css('width',
            Math.round((data.loaded * 100.0) / data.total) + '%');
        }
      });
  },

  uploadVideo: function(settings, options) {

  },

  uploadFile: function(settings, options) {

  }
};

Template.cloudinaryUploader.helpers({
  buttonHtml: function() {
    return Cloudinary.buttonHtml; //'<i class="fa fa-image"></i><span>Upload...</span>';
  }
});