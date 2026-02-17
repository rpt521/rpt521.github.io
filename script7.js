//script7.js

//global variable for count
let count = 0;

//increase function tickup
functoin tickUp() {
	count = count + 1;
	updateDisplay();
}

//decrease function tickdown
function tickDown() {
	count = count - 1;
	updateDisplay();
}

//update html
function updateDisplay() {
	document.getElementById("counter").textContent = count;
}

