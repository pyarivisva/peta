const Joi = require('joi');

const AuthValidator = {
  validateLoginPayload: (payload) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    return schema.validate(payload);
  },
  
  validateRegisterPayload: (payload) => {
    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(6).required(),
      email: Joi.string().email().allow(null, ''),
    });
    return schema.validate(payload);
  }
};

module.exports = AuthValidator;