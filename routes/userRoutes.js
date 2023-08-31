const {
	getAllUsers,
	createUser,
	getOneUser,
	updateUser,
	deleteUser,
} = require('../controllers/userController');
const { signUp, login } = require('./../controllers/authController');

const express = require('express');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getOneUser).patch(updateUser).delete(deleteUser);

module.exports = router;
