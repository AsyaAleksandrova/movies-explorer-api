const { celebrate, Joi } = require('celebrate');

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    image: Joi.string().required().regex(/https*:\/\/\w+/),
    trailerLink: Joi.string().required().regex(/https*:\/\/\w+/),
    thumbnail: Joi.string().required().regex(/https*:\/\/\w+/),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = validateNewMovie;
