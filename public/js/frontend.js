
const chatForm = document.getElementById('form');
const fieldForMessages = document.getElementById('messages_field');
const roomName = document.getElementById('room-name');
const listOfGroups = document.querySelector('.activated');//or users
const userGroupsToLight = document.querySelectorAll('.users');
const groupNameToDisplay = document.querySelector('.group-name');
const getFieldMsg = document.querySelector('.two_messages');

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});


const activeRoom = document.querySelector('.active__room');
const activeDirect = document.querySelector('.active__direct');
const roomTab = document.querySelector('.one_rooms');
const directTab = document.querySelector('.one_directs');

window.addEventListener("load", function() {
	activeRoom.classList.add('show');
	activeRoom.innerHTML = `Rooms<span class="circle"></span>`;
})
activeDirect.addEventListener('click', function(){
	roomTab.style.display = 'none';
	activeRoom.classList.remove('show');
	activeDirect.innerHTML = `Directs<span class="circle"></span>`;
	activeRoom.innerHTML = `Rooms`;
	activeDirect.classList.add('show');
	directTab.style.display = 'block';
})

activeRoom.addEventListener('click', function(){
	activeRoom.classList.add('show');
	activeRoom.innerHTML = `Rooms<span class="circle"></span>`;
	activeDirect.innerHTML = `Directs`;
	activeDirect.classList.remove('show');
	roomTab.style.display="block";
	directTab.style.display = 'none';
})


const socket = io();

	const nsp = io("/ADMIN");
	///ADMIN RULES
	nsp.on("hi", (data) => {
		
	});
	

//run when client connects
socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
	
	if(room == "learn-javascript"){
		groupNameToDisplay.innerText = "learn-javascript";
	}
	if(room == "private"){
		groupNameToDisplay.innerText = "private";
         if(users.length > 2){
					window.location = '../index.html';
			}
	}
	
	///GET SOCKET
   //outputRoomName(room);
	outputUsers(users);
	if(room == "learn-javascript"){
		userGroupsToLight[0].classList.add('backlight');
	}
	if(room == "announcements"){
		userGroupsToLight[1].classList.add('backlight');
		groupNameToDisplay.innerText = "announcements"
	}
	if(room == "web-design"){
		userGroupsToLight[2].classList.add('backlight');
		groupNameToDisplay.innerText = "web-design"
	}
   if(username == "ADMIN" || username == "admin" ){
		document.addEventListener('click', (e) => {
			let name = e.target;
			let getName = users.find(el => el.username === name.innerText);
			if(getName !== undefined){
				  socket.emit("sendObj", getName);
			}
	  })
	}

});


socket.on('message', (message) => {
	outputMessage(message);
	//Scroll down
	fieldForMessages.scrollTop = fieldForMessages.scrollHeight;
});


//Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	//Get message text
   let messageValue = document.getElementById('input');
   let msg = messageValue.value;
	if(!msg) {
		return false;
	}

	//Emit message to server
	socket.emit('chatMessage', msg);

	//Clear input
	//e.target.elements.msg.value = '';
	//e.target.elements.msg.focus();
	messageValue.value = '';
	messageValue.focus();
	
});

//Output message to DOM
function outputMessage(message) {

	   let arrImages = ["../img/user-1.jpg", "../img/user-3.png", "../img/user-2.png"];
      let img = arrImages[(Math.floor(Math.random() * arrImages.length))];

      const div = document.createElement('div');
		div.classList.add('message');
		const p = document.createElement('p');
		p.innerHTML += `<p class="images"><img src=${img}></p>${message.username}<span class="time">${message.time}</span>`;
		div.appendChild(p);

		const para = document.createElement('p');
		para.classList.add('text');
		para.innerText = message.text;
		div.appendChild(para);
		fieldForMessages.appendChild(div);

		getFieldMsg.scrollTop = getFieldMsg.scrollHeight;

		
}



//Add room name to DOM

/*function outputRoomName(room){
	roomName.innerText = room;
}*/

//Add names online to DOM
function outputUsers(users) {
	listOfGroups.innerHTML = '';
		users.forEach((user) => {
			const li = document.createElement('li');
			li.classList.add('delete');
			li.innerText = user.username;
			listOfGroups.appendChild(li);
		});
	
}

const leaveBtn = document.querySelector('.leave-close');
leaveBtn.addEventListener('click', () => {
	const leaveRoom = confirm('Are you sure you want to leave the chatroom?');

	if(leaveRoom){
      window.location = '../index.html';
	}
});


///CHANGE QUANTITY OF ONLINE USERS 

let basket = JSON.parse(localStorage.getItem('data', JSON.stringify('quanties')));

let basketLength = basket.length;

const quantityDom = document.querySelector('.quantity');
quantityDom.innerHTML = `<p>${basketLength}</p>`;







