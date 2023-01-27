const router = require('express').Router();
const validateUserInfo = require('../middlewares/validateUserInfo');

const { getMyUser, updateMyUser } = require('../controllers/users');

router.get('/me', getMyUser);
router.patch('/me', validateUserInfo, updateMyUser);

module.exports = router;
