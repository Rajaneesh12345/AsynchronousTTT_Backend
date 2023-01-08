const { errorHandler } = require('./middleware/errorMiddleware');
require('colors');
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);

// here we are defining the socket.io server
const { Server } = require('socket.io');
const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', socket => {
	console.log('A user is connected'.brightMagenta.underline);

	socket.on('disconnect', () => {
		console.log(`socket ${socket.id} disconnected`);
	});
});

module.exports = { io };
connectDB();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Hello World!' });
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));

//custom error handler
app.use(errorHandler);

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
	console.log(`App listening on port ${port}`.green.underline);
});
