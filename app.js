const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorhandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const validateNewUser = require('./middlewares/validateNewUser');
const validateAuth = require('./middlewares/validateAuth');
const checktoken = require('./middlewares/checktoken');
const { registerUser, loginUser, logoutUser } = require('./controllers/users');
require('dotenv').config();

const { PORT, MONGO_URL, CORS_ORIGIN } = process.env;

const app = express();

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signup', validateNewUser, registerUser);
app.post('/signin', validateAuth, loginUser);
app.post('/signout', checktoken, logoutUser);

app.use((req, res, next) => {
  next(new NotFoundError('Не корректно задан адрес запроса'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
