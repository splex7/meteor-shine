Template.preference.helpers({
  themes: function() {
    return Themes;
  }
});

Template.preference.events({
  'change input:radio[name=theme]': function(e) {
    e.preventDefault();

    var themeName = $(e.target).val();
    saveTheme(themeName);
  }
});

Template.themeListItem.helpers({
  isChecked: function() {
    return (this._id === loadTheme());
  }
});

