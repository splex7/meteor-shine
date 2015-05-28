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

    // Get 'background-color' of body
    // Then set 'background-color' to '.aside-left,right'
    //
    // Get 'border-color' of panel-default
    // Then set 'border-color' to '.aside-left,right'
    //
    // Need to find sweetspot to grab border color
    setTimeout( function () {
      var bodyBg = $('body').css('background-color');
      var border = $('.panel.panel-default').css('border-color');

      $('.aside-left').css('background-color', bodyBg);
      $('.aside-left').css('border-color', border);

      $('.aside-right').css('background-color', bodyBg);
      $('.aside-right').css('border-color', border);
    }, 300);

  }
});
