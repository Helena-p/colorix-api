const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
	console.log(err.name, err.message);
	// shut down application on uncaught exception
	process.exit(1);
});

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);
// connect to DB with some settings for deprecation warnings
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful'));
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
	console.log(err);
	server.close(() => {
		// shut down application on uncaught exception
		process.exit(1);
	});
});
