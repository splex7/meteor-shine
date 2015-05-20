Template.preference.helpers({
  isChecked: function(theme) {
    return this.theme && this.theme.value === theme;
  }
});

Template.preference.events({
  'change input:radio[name=theme]': function(e) {
    e.preventDefault();

    $('.data-theme').remove();

    var themeName = $(e.target).val();

    var themeSheet = $('<link href="'+themes[themeName]+'" rel="stylesheet" class="data-theme"/>');

    themeSheet.appendTo('head');
  }
});
