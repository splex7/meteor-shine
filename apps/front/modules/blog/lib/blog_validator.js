
BlogValidator = {
  schema: {
    title: {
      name: 'title',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    },

    content: {
      name: 'content',
      type: 'string',
      required: true,
      minLength: 1,
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

matchBlogInsert = function(object) {
  var validation = BlogValidator.validateInsert(object);
  return _.isEmpty(validation.errors());
};

matchBlogEdit = function(object) {
  var validation = BlogValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};
