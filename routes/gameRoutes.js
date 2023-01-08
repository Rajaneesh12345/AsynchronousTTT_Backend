const express = require('express');
const router = express.Router();
const {
	createGame,
	updateGame,
	getGame,
	getAllGames,
} = require('../controllers/gameController');

const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createGame);
router.put('/update/:id', protect, updateGame);
router.get('/:id', protect, getGame);
router.get('/', protect, getAllGames);

module.exports = router;
