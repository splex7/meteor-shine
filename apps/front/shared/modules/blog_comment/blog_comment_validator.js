BlogCommentValidator = {
  schema: {
    blogId: {
      name: 'blogId',
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 40
    },
    msg: {
      name: 'msg',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 200
    }
  },

  validateInsert: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['blogId', 'msg']);

    return validator;
  }
};
