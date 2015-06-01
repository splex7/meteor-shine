/**
 * Accounts configuration
 */

/**
 * accounts-ui package configuration
 */
Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});



/**
 * Facebook login configuration
ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: Meteor.settings.facebook.appId,
  secret: Meteor.settings.facebook.secret
});
 */

/**
 * check the validation of user information
 * initialize user information
 */
Accounts.onCreateUser(function(options, user) {
  console.log('onCreateUser:options = ' + JSON.stringify(options));
  console.log('onCreateUser:user = ' + JSON.stringify(user));

  user.profile = {
    avatarUrl: "/images/default_profile.png",
    tempUrl: "",
    tempId: "",
    originUrl: "",
    publicId: "",
    position: {
      left: 0,
      top: 10,
      width: 280,
      height: 280
    }
  }

  /*
  user.profile = {
    state: 10,
    mobile: {
      no: "",
      os: -1,
      deviceToken: ""
    },
    wallet: {
      coupon: 0,
      point: 0,
      sumCoupon: 0,
      sumPoint: 0,
      usedCoupon: 0,
      usedPoint: 0
    }
  };
  */

  return user;
});



/**
 * validate user login
 *
 */
Accounts.validateLoginAttempt(function(info) {
  /*
  if (info && info.user) {
    if (info.user.profile.state !== USER_STATE_ACTIVE)
      throw new Meteor.Error(ERROR_CODE_SECURITY, I18n.get('error_account_not_active'));
  } else {
    return false;
  }
  */
  return true;
});


