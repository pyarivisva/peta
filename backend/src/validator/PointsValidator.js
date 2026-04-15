const Joi = require('joi');

const PointsValidator = {
  validatePointPayload: (payload) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      address: Joi.string().allow(''),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      type_id: Joi.number().integer().required(),
      phone: Joi.string().allow(''),
      status: Joi.string().allow(''),
      image_url: Joi.string().allow(null, ''),
      kept_images: Joi.any(),
      tags: Joi.array().items(Joi.string()).default([])
    });

    return schema.validate(payload);
  },
};

module.exports = PointsValidator;