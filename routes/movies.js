const router = require('express').Router();
const validateNewMovie = require('../middlewares/validateNewMovie');
const checkDuplicate = require('../middlewares/checkDuplicate');
const validateMovieId = require('../middlewares/validateMovieId');

const { addMovieToMyList, getMyMovieList, deleteMovieFromMyList } = require('../controllers/movies');

router.post('/', validateNewMovie, checkDuplicate, addMovieToMyList);
router.get('/', getMyMovieList);
router.delete('/:_id', validateMovieId, deleteMovieFromMyList);

module.exports = router;
