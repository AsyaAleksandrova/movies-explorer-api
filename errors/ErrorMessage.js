const MONGO_DUPLICATE_ERROR_CODE = 11000;
const MESSAGE_OTHER_ERROR = 'Что-то пошло не так: ';
const MESSAGE_AUTH = 'Неправильные почта или пароль';
const MESSAGE_FORBIDDEN = 'Отсутствуют права на удаление фильма из списка';
const MESSAGE_CONFLICT_EMAIL = 'Пользователь с таким email уже зарегистрирован';
const MESSAGE_VALIDATION = 'Переданы некорректные данные при создании/изменении карточки: ';

module.exports = {
  MONGO_DUPLICATE_ERROR_CODE,
  MESSAGE_OTHER_ERROR,
  MESSAGE_AUTH,
  MESSAGE_FORBIDDEN,
  MESSAGE_CONFLICT_EMAIL,
  MESSAGE_VALIDATION,
};
