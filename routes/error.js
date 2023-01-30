const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

router.use('*', (req, res, next) => {
  next(new NotFoundError('Не корректно задан адрес запроса'));
});

module.exports = router;
