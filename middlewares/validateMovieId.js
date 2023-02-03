const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const validateMovieId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

module.exports = validateMovieId;
