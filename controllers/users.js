const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_KEY } = process.env;

const {
  MONGO_DUPLICATE_ERROR_CODE,
  MESSAGE_OTHER_ERROR,
  MESSAGE_AUTH,
  MESSAGE_CONFLICT_EMAIL,
  MESSAGE_VALIDATION,
} = require('../errors/ErrorMessage');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const OtherServerError = require('../errors/OtherServerError');
const AuthError = require('../errors/AuthError');

module.exports.registerUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY : 'dev-secret', { expiresIn: '10d' });
      res
        .cookie('jwt', token, {
          maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true,
        })
        .status(201)
        .send({ user: { name: user.name, email: user.email, _id: user._id } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${MESSAGE_VALIDATION + err.message}`));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError(MESSAGE_CONFLICT_EMAIL));
      } else {
        next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
      }
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email }).select('+password')
    .orFail()
    .then((user) => bcrypt.compare(password, user.password)
      .then((compare) => {
        if (!compare) {
          next(new AuthError(MESSAGE_AUTH));
        } else {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY : 'dev-secret', { expiresIn: '30d' });
          res
            .status(200)
            .cookie('jwt', token, {
              maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true,
            })
            .send({ user: { name: user.name, email: user.email, _id: user._id } });
        }
      }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new AuthError(MESSAGE_AUTH));
      } else {
        next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
      }
    });
};

module.exports.logoutUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .then(() => {
      res.clearCookie('jwt', { httpOnly: true });
      res.status(200).json({ message: 'OK' });
    })
    .catch((err) => {
      next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
    });
};

module.exports.getMyUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
    });
};

module.exports.updateMyUser = (req, res, next) => {
  User
    .findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, email: req.body.email },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${MESSAGE_VALIDATION + err.message}`));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError(MESSAGE_CONFLICT_EMAIL));
      } else {
        next(new OtherServerError(`${MESSAGE_OTHER_ERROR + err.message}`));
      }
    });
};
