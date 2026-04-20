const Joi = require('joi');

const PointsValidator = {
  validatePointPayload: (payload) => {
    let parsedDetails = payload.details;
    if (typeof payload.details === 'string') {
      try {
        parsedDetails = JSON.parse(payload.details);
      } catch (e) {
        // Continue with raw details if parsing fails
      }
    }

    const payloadToValidate = {
      ...payload,
      details: parsedDetails,
    };

    const schema = Joi.object({
      name: Joi.string().required().messages({ 'any.required': 'Nama lokasi wajib diisi' }),
      description: Joi.string().allow('', null),
      address: Joi.string().allow('', null),
      latitude: Joi.number().required().messages({ 'any.required': 'Latitude wajib diisi' }),
      longitude: Joi.number().required().messages({ 'any.required': 'Longitude wajib diisi' }),
      type_id: Joi.number().integer().required(),
      phone: Joi.string().allow('', null),
      status: Joi.string().valid('Open', 'Closed', 'Under Renovation').default('Open'),
      image_url: Joi.string().allow(null, ''),
      kept_images: Joi.any(),
      tags: Joi.array().items(Joi.string()).default([]),
      cluster_name: Joi.string().allow('', null),
      details: Joi.object().when('cluster_name', {
        switch: [
          {
            is: Joi.string().valid('Restoran', 'Food & Beverage', 'Food'),
            then: Joi.object({
              signature_menu: Joi.string().allow('', null),
              price_min: Joi.number().allow(null),
              price_max: Joi.number().allow(null),
              opening_hours: Joi.string().allow('', null),
              open_time: Joi.string().allow('', null),
              close_time: Joi.string().allow('', null),
              menu_image_url: Joi.string().allow('', null),
              is_halal: Joi.boolean().allow(null).default(false),
              has_wifi: Joi.boolean().allow(null).default(false),
            }).unknown(true),
          },
          {
            is: Joi.string().valid('Alam', 'Nature & Outdoor', 'Nature'),
            then: Joi.object({
              elevation: Joi.number().allow(null),
              difficulty_level: Joi.string().allow('', null),
              entry_fee_min: Joi.number().allow(null),
              entry_fee_max: Joi.number().allow(null),
              public_facilities: Joi.string().allow('', null),
              facility_ids: Joi.array().items(Joi.number().integer()).default([]),
            }).unknown(true),
          },
          {
            is: Joi.string().valid('Accommodation'),
            then: Joi.object({
              star_rating: Joi.number().allow(null).min(1).max(5),
              check_in_time: Joi.string().allow('', null),
              check_out_time: Joi.string().allow('', null),
              has_pool: Joi.boolean().allow(null).default(false),
            }).unknown(true),
          },
          {
            is: Joi.string().valid('Healthcare'),
            then: Joi.object({
              facility_type: Joi.string().allow('', null),
              healthcare_type_ids: Joi.array().items(Joi.number().integer()).default([]),
              has_igd: Joi.boolean().allow(null).default(false),
              accepts_bpjs: Joi.boolean().allow(null).default(false),
              ambulance_available: Joi.boolean().allow(null).default(false),
            }).unknown(true),
          },
          {
            is: Joi.string().valid('Education'),
            then: Joi.object({
              education_level: Joi.string().allow('', null),
              accreditation: Joi.string().allow('', null),
              school_status: Joi.string().allow('', null),
              has_library: Joi.boolean().allow(null).default(false),
            }).unknown(true),
          },
        ],
        otherwise: Joi.any(),
      }).allow(null),
    });

    return schema.validate(payloadToValidate, { abortEarly: false, stripUnknown: true });
  },
};

module.exports = PointsValidator;