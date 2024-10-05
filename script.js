let displayValue = "0";
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

function updateDisplay() {
    display.textContent = displayValue;
}

function handleNumber(value) {
    // If waiting for second value, start new number input
    if (waitingForSecondValue) {
        displayValue = value;  // Start new number
        waitingForSecondValue = false;
    } else {
        // Concatenate numbers; reset if the display is currently "0"
        displayValue = displayValue === "0" ? value : displayValue + value;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const value = parseFloat(displayValue);

    // If we have a first value, an operator, and are waiting for the second value
    if (firstValue === null) {
        firstValue = value;  // Store the first number
    } else if (operator) {
        const result = performCalculation(firstValue, value, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;  // Show result
        firstValue = result;  // Update first value for the next operation
    }

    operator = nextOperator;  // Update operator
    displayValue += ` ${operator}`;  // Display the operator on screen
    updateDisplay();  // Update the display with the operator
    waitingForSecondValue = true;  // Now we're waiting for the second value
}

function performCalculation(first, second, operator) {
    switch (operator) {
        case "+":
            return first + second;
        case "-":
            return first - second;
        case "*":
            return first * second;
        case "/":
            return second === 0 ? "Error" : first / second;  // Prevent division by zero
        default:
            return second;
    }
}

function handleClear() {
    displayValue = "0";  // Reset display value
    firstValue = null;   // Reset first value
    operator = null;     // Reset operator
    waitingForSecondValue = false;  // Reset waiting state
    updateDisplay();     // Update display
}

// Event Listeners for numbers and operators
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const { value } = button.dataset;

        if (!isNaN(value)) {
            handleNumber(value);
        } else if (value === ".") {
            // Prevent multiple decimal points in the same number
            if (!displayValue.includes(".")) {
                displayValue += ".";
                updateDisplay();
            }
        } else if (value === "C") {  // Check for clear button
            handleClear();
        } else {
            handleOperator(value);
        }
    });
});

// Event listener for the equal button
document.getElementById("equal").addEventListener("click", () => {
    const value = parseFloat(displayValue.split(" ")[0]); // Extract the first number

    if (firstValue !== null && operator && !waitingForSecondValue) {
        const result = performCalculation(firstValue, value, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;  // Show result
        firstValue = null;  // Reset the first value
        operator = null;    // Clear the operator after the calculation
        updateDisplay();
    }
});
