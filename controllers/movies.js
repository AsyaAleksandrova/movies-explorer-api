const Movie = require('../models/movie');

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
        next(new ValidationError(`Переданые некорректные данные при добавлении фильма: ${err.message}`));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
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
      next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
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
            res.status(200).send({ message: `Из списка удалена карточка ${movie._id}` });
          });
      } else {
        next(new ForbiddenError('Отсутствуют права на удаление фильма из списка'));
      }
    });
};
