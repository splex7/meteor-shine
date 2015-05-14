Package.describe({
  name: 'leesangwon:cloudinary-direct',
  version: '0.1.0',
  summary: 'upload API for direct image upload from browser to cloudinary.com',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'templating',
    'tracker'
  ], 'client');

  api.addFiles([
    'lib/jquery.ui.widget.js',
    'lib/jquery.iframe-transport.js',
    'lib/jquery.fileupload.js',
    'lib/jquery.cloudinary.js'
  ], 'client');

  api.addFiles([
    'cloudinary.html',
    'cloudinary.css',
    'cloudinary.js'
  ], 'client');

  api.export('Cloudinary');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:cloudinary-direct');
  api.addFiles('cloudinary-direct-tests.js');
});
