const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_KEY } = process.env;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const OtherServerError = require('../errors/OtherServerError');

module.exports.registerUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY : 'dev-secret', { expiresIn: '10d' });
      res
        .cookie('jwt', token, {
          maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true, SameSite: 'Lax', Secure: true,
        })
        .status(201)
        .send({ user: { name: user.name, email: user.email, _id: user._id } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Переданы некорректные данные при создании пользователя: ${err.message}`));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};
