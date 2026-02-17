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
	
	for (i = 0; i <= count; i++) {
		output += i + " ";
	}

	document.getElementById("forLoopResult").textContent = output;
}

function showOddNumbers() {
	if (count < 1) {
        document.getElementById("oddNumberResult").textContent =
            "Counter is negative. No odd numbers to display.";
        return;
    }
	
    let output = "";

    for (let i = 1; i <= count; i++) {

        if (i % 2 !== 0) {   // checks if odd
            output += i + " ";
        }
	}

    document.getElementById("oddNumberResult").textContent = output;
	}

function addMultiplesToArray() {

    let arr = [];

    if (count < 5) {
        console.log(arr);   
        return;
    }

    for (let i = count; i >= 5; i--) {

        if (i % 5 === 0) {
            arr.push(i);
        }

    }

    console.log(arr);
}

function printCarObject() {

    const type = document.getElementById("carType").value;
    const mpg = document.getElementById("carMPG").value;
    const color = document.getElementById("carColor").value;

    const car = {
        type: type,
        mpg: mpg,
        color: color
    };

    console.log(car);
}

function loadCar(num) {

    let selectedCar;

    if (num === 1) {
        selectedCar = carObject1;
    } 
    else if (num === 2) {
        selectedCar = carObject2;
    } 
    else if (num === 3) {
        selectedCar = carObject3;
    }
	else return;

    document.getElementById("carType").value = selectedCar.cType;
    document.getElementById("carMPG").value = selectedCar.cMPG;
    document.getElementById("carColor").value = selectedCar.cColor;
}

function changeColor(num) {

    const para = document.getElementById("styleParagraph");

    const colors = {
        1: "red",
        2: "green",
        3: "blue"
    };

    para.style.color = colors[num];
}





