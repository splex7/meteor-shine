var buttonDeps = new Tracker.Dependency;

/**
 *
 * @type {{uploadSelector: string, buttonHtml: string, uploadImage: Function, uploadImagePreset: Function, uploadVideo: Function, uploadFile: Function}}
 */
Cloudinary = {
  _buttonHTML: '<span>upload...</span>',

  uploadSelector: '.cloudinary-fileupload',

  getButtonHTML: function() {
    buttonDeps.depend();
    return this._buttonHTML;
  },

  setButtonHTML: function(html) {
    this._buttonHTML = html;
    buttonDeps.changed();
  },

  /**
   * upload image using preset feature of Cloudinary.com
   *
   * @param options
   *    cloudName: cloud_name of cloudinary.com
   *
   *    preset: preset name to applied to the upload image
   *
   *    options:
   *      multiple: if true, you can upload multiple files
   *
   *    buttonHTML: button HMTL code
   *
   *    progress:
   *      enable: if true, show upload progress bar
   *      window: selector of progress bar window
   *      bar: selector of progress bar
   *
   * @param callback: callback function to process the result
   *    callback parameters
   *      error: returned error when upload fails
   *      data: result value when upload succeeds
   */
  uploadImagePreset: function(options, callback) {
    if (options.buttonHTML) {
      this.setButtonHTML(options.buttonHTML);
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

  uploadImage: function(options, callback) {
    callback();
  },

  uploadVideo: function(options, callback) {
    callback();
  },

  uploadFile: function(options, callback) {
    callback();
  }
};

Template.cloudinaryUploader.helpers({
  buttonHtml: function() {
    return Cloudinary.getButtonHTML();
  }
});
