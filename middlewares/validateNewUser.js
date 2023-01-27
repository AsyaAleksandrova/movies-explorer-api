const { celebrate, Joi } = require('celebrate');

const validateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().regex(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/),
    password: Joi.string().required(),
  }),
});

module.exports = validateNewUser;
