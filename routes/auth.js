const router = require('express').Router();

const { registerUser, loginUser, logoutUser } = require('../controllers/users');
const validateNewUser = require('../middlewares/validateNewUser');
const validateAuth = require('../middlewares/validateAuth');
const checktoken = require('../middlewares/checktoken');

router.post('/signup', validateNewUser, registerUser);
router.post('/signin', validateAuth, loginUser);
router.post('/signout', checktoken, logoutUser);

module.exports = router;
