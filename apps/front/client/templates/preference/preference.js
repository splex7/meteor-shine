Template.preference.helpers({
  isChecked: function(theme) {
    return this.theme && this.theme.value === theme;
  }
});

Template.preference.events({
  'change input:radio[name=theme]': function(e) {
    e.preventDefault();

    $('body').attr('data-theme', $(e.target).val());
  }
});
