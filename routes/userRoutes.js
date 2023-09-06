const {
	getAllUsers,
	createUser,
	getOneUser,
	updateUser,
	deleteUser,
} = require('../controllers/userController');
const {
	signUp,
	login,
	protect,
	restrictTo,
} = require('./../controllers/authController');

const express = require('express');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router
	.route('/')
	.get(protect, restrictTo('admin'), getAllUsers)
	.post(createUser);
router
	.route('/:id')
	.get(protect, restrictTo('admin'), getOneUser)
	.patch(protect, updateUser)
	.delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
