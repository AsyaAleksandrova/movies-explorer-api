const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorhandler');
const { limiter } = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const checktoken = require('./middlewares/checktoken');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.set('strictQuery', true);

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(limiter);

app.use('/', require('./routes/auth'));
app.use('/users', checktoken, require('./routes/users'));
app.use('/movies', checktoken, require('./routes/movies'));
app.use('/', require('./routes/error'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
