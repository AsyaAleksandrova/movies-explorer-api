const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorhandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const validateNewUser = require('./middlewares/validateNewUser');
const { registerUser } = require('./controllers/users');
require('dotenv').config();

const { PORT, MONGO_URL, CORS_ORIGIN } = process.env;

const app = express();

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signup', validateNewUser, registerUser);

app.use((req, res, next) => {
  next(new NotFoundError('Не корректно задан адрес запроса'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
