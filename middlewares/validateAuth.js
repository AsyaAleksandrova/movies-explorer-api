const { celebrate, Joi } = require('celebrate');

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/),
    password: Joi.string().required(),
  }),
});

module.exports = validateAuth;
