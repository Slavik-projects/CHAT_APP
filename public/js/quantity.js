const buttonSend = document.getElementById('login-form');

let quanties = [];




buttonSend.addEventListener('submit', setQuantity);
function setQuantity(){
   quanties.push({
		user: 1
	});

	localStorage.setItem('data', JSON.stringify(quanties))
}

