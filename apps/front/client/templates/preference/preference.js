Template.preference.helpers({
  isChecked: function(theme) {
    return this.theme && this.theme.value === theme;
  }
});

Template.preference.events({
  'change input:radio[name=theme]': function(e) {
    e.preventDefault();

    //$('body').attr('data-theme', $(e.target).val());
    //

    var themes = {
      "default": "/themes/default.css",
      "cerulean" : "/themes/cerulean.css"
    };

    var themeName = $(e.target).val();

    var themesheet = $('<link href="'+themes[themeName]+'" rel="stylesheet" data-theme="theme"/>');

    themesheet.appendTo('head');
  }
});
