const Movie = require('../models/movie');
const ConflictError = require('../errors/ConflictError');

module.exports = (req, res, next) => {
  Movie.findOne({ owner: req.user._id, movieId: req.body.movieId })
    .then((movie) => {
      if (movie._id) {
        next(new ConflictError('Карточка с таким идентификатором уже добавлена в список данного пользователя'));
      } else {
        next();
      }
    });
};
