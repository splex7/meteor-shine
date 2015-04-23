Package.describe({
  name: 'leesangwon:bootstrap-less',
  version: '0.9.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  
  api.use('jquery', 'client');
  api.imply(['less']);
 
  api.addFiles('bootstrap-less.js');
  
  api.addFiles('3.3.2/js/bootstrap.js', 'client');

  api.addFiles('3.3.2/fonts/glyphicons-halflings-regular.eot', 'client', { isAsset: true });
  api.addFiles('3.3.2/fonts/glyphicons-halflings-regular.svg', 'client', { isAsset: true });
  api.addFiles('3.3.2/fonts/glyphicons-halflings-regular.ttf', 'client', { isAsset: true });
  api.addFiles('3.3.2/fonts/glyphicons-halflings-regular.woff', 'client', { isAsset: true });
  api.addFiles('3.3.2/fonts/glyphicons-halflings-regular.woff2', 'client', { isAsset: true });

  api.addFiles('bookpal.png', 'client', { isAsset: true });

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:bootstrap-less');
  api.addFiles('bootstrap-less-tests.js');
});
