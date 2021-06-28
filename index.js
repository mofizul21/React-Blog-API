const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const catRoute = require('./routes/categories');
const multer = require('multer');

// support env file
const app = express();
dotenv.config();

// parse request to body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// database connection
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(console.log('Database connected'))
	.catch((err) => console.log(err));

// file upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
	res.status(200).json('File has been uploaded!');
});

// api route
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', catRoute);

app.listen(process.env.PORT, () => {
	console.log(`App is running under ${process.env.PORT}`);
});
