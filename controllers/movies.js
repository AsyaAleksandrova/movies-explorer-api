const Movie = require('../models/movie');

const {
  MESSAGE_OTHER_ERROR,
  MESSAGE_FORBIDDEN,
  MESSAGE_VALIDATION,
} = require('../errors/ErrorMessage');
const ValidationError = require('../errors/ValidationError');
const OtherServerError = require('../errors/OtherServerError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.addMovieToMyList = (req, res, next) => {
  const owner = req.user._id;
  Movie
    .create({ ...req.body, owner })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${MESSAGE_VALIDATION + err.message}`));
      } else {
        next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
      }
    });
};

module.exports.getMyMovieList = (req, res, next) => {
  Movie
    .find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => {
      next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
    });
};

module.exports.deleteMovieFromMyList = (req, res, next) => {
  Movie
    .findById(req.params._id)
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        Movie
          .findByIdAndRemove(req.params._id)
          .then(() => {
            res.status(200).send({ message: `${movie._id}` });
          });
      } else {
        next(new ForbiddenError(MESSAGE_FORBIDDEN));
      }
    })
    .catch((err) => {
      next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
    });
};
