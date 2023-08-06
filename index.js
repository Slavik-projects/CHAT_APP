const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./helpers/formatDate');

const {
	getActiveUser,
	exitRoom,
	newUser,
	getIndividualRoomUsers
} = require('./helpers/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const path = require('path');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//ADMIN
const nsp = io.of("/ADMIN");

nsp.on("connection", (admin) => {
	//console.log("someone connected");
	nsp.emit("hi", "everyone!");
});

	io.on('connection',  (socket) => {

		socket.on('joinRoom', async ({ username, room }) => {

			const user = newUser(socket.id, username, room);
			socket.join(user.room);

			//ADMIN
			var sockets = await io.fetchSockets();
			console.log(sockets.length);

			socket.on("sendObj", nameObject => {
				let selSocket = sockets.find(item => item.id === nameObject.id);
				console.log(selSocket);
				selSocket.disconnect(user.room);
			})
			
			//General welcome
			socket.emit('message', formatMessage("Welcome to our chat", 'Messages are limited to this room!'));
	
			//Broadcast everytime users connects
			socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage("ChatName", `${user.username} has joined the room`)
			);
	
			//Current active users and room name
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getIndividualRoomUsers(user.room)
			});
		});
	
		//Listen for client message
		socket.on('chatMessage', msg => {
			const user = getActiveUser(socket.id);
	
			io.to(user.room).emit('message', formatMessage(user.username, msg));
		});
	
		//Runs when client disconnects
		socket.on('disconnect', () => {
			const user = exitRoom(socket.id);
	
			if(user) {
				io.to(user.room).emit(
					'message',
					formatMessage(`User`, `${user.username} has left the room`)
				);
	
				//Current active users and room name
				io.to(user.room).emit('roomUsers', {
					room: user.room,
					users: getIndividualRoomUsers(user.room)
				});
			}
		});
		
	});
	

//it runs when client conects

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



