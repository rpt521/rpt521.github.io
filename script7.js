//script7.js

//global variable for count
let count = 0;

//increase function tickup
function tickUp() {
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

function runForLoop() {
	if (count < 0) {
        document.getElementById("forLoopResult").textContent = "Counter is negative";
        return;
    }
	
	let output = "";
	
	for (i = 0, i <= count, i++) {
		output += i + " ";
	}

	document.getElementById("forLoopResult").textContent = output;

