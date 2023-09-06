const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	// testing with mailtrap.io
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: false,
		logger: true,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: 'Colorix support team <helena@colorix.io>',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
