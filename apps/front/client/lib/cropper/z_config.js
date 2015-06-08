
var PREVIEW_CLASS = '.avatar-preview';
// cropperjs default options object
var cropperOptions = {
  aspectRatio: 1/1,
  autoCropArea: 1,
  strict: true,
  minCanvasWidth: 280, // Width of canvas-container to keep 1:1 at all times
  // minCanvasWidth: 280, // Width of canvas-container to keep 1:1 at all times
  responsive: false,
  background: false,
  highlight: false,
  dragCrop: false,
  movable: false,
  resizable: false,
  preview: PREVIEW_CLASS,
};

// apply cropperjs default setting
$.fn.cropper.setDefaults(cropperOptions);