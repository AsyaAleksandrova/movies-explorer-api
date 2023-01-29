/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorhandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const validateNewUser = require('./middlewares/validateNewUser');
const validateAuth = require('./middlewares/validateAuth');
const checktoken = require('./middlewares/checktoken');
const { registerUser, loginUser, logoutUser } = require('./controllers/users');
require('dotenv').config();

const {
  PORT = 3000, MONGO_URL, CORS_ORIGIN, NODE_ENV,
} = process.env;

const app = express();

app.use(cors({
  origin: NODE_ENV === 'production' ? CORS_ORIGIN : 'http://localhost:3000',
  credentials: true,
}));

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.set('strictQuery', true);

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signup', validateNewUser, registerUser);
app.post('/signin', validateAuth, loginUser);
app.post('/signout', checktoken, logoutUser);

app.use('/users', checktoken, require('./routes/users'));
app.use('/movies', checktoken, require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Не корректно задан адрес запроса'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
