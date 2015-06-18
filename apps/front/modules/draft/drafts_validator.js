
DraftValidator = {
  schema: {
    title: {
      name: 'title',
      type: 'string',
      required: false,
      minLength: 0,
      maxLength: 100
    },

    content: {
      name: 'content',
      type: 'string',
      required: false,
      minLength: 0,
      maxLength: 65536
    }
  },

  validateInsert: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content']);

    return validator;
  },

  validateUpdate: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content']);

    return validator;
  }
};

matchDraftInsert = function(object) {
  var validation = DraftValidator.validateInsert(object);
  return _.isEmpty(validation.errors());
};

matchDraftUpdate = function(object) {
  var validation = DraftValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};
