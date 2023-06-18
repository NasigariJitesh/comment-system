require('dotenv').config();

import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import commentRoutes from './routes/comment';
import replyRoutes from './routes/reply';
import documentRoutes from './routes/document';

const app = express();

const password = encodeURIComponent(process.env.PASSWORD || ' ');

//@ts-ignore
mongoose
	.connect(
		`mongodb+srv://nasigarijr:${password}@cluster0.zskkef6.mongodb.net/docsComments?retryWrites=true&w=majority`,
		{}
	)
	.then(() => {
		console.log('DB CONNECTED');
	});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//using Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', commentRoutes);
app.use('/api', replyRoutes);
app.use('/api', documentRoutes);

//PORT
const port = process.env.PORT ?? 8000;

//Starting a Server
app.listen(port, () => {
	console.log(`app is running at ${port}`);
});
