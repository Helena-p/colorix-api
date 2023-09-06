const {
	getAllUsers,
	createUser,
	getOneUser,
	updateUser,
	deleteUser,
} = require('./../controllers/userController');
const {
	signUp,
	login,
	protect,
	restrictTo,
	forgotPassword,
	resetPassword,
} = require('./../controllers/authController');

const express = require('express');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router
	.route('/')
	.get(protect, restrictTo('admin'), getAllUsers)
	.post(createUser);
router
	.route('/:id')
	.get(getOneUser)
	.patch(protect, updateUser)
	.delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
