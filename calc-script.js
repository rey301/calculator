function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function operate (operator, num1, num2) {
    switch (operator) {
        case '+':
            return add(num1, num2);

        case '–':
            return subtract(num1, num2);

        case '×':
            return multiply(num1, num2);

        case '÷':
            return divide(num1, num2);

        default: 
            return "Error: invalid operator";
    }
}

// replace decimal event listener; so that it can only be clicked once
function replaceDecimalListener() {
    const oldBtn = document.querySelector('.decimal');
    const newBtn = oldBtn.cloneNode(true);

    newBtn.addEventListener('click', function cb(e) {
        if (output.textContent.replace(/,|\./g, '').length < 9) {
            output.textContent += e.target.textContent;
        }
        e.currentTarget.removeEventListener(e.type, cb);
    }, {once: true});

    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
}

// inserts comma for every third character
function insertComma(outText) {
    if (!outText.includes('.')) {
        outText = outText.replace(/,/g, '');
        if (outText.replace(/-/g, '').length > 3 && 
            outText.replace(/-/g, '').length <= 6) {
                outText = outText.slice(0, outText.length - 3) +
                    ',' +
                    outText.slice(outText.length - 3);
        } else if (outText.replace(/-/g, '').length > 6) {
            outText = outText.slice(0, outText.length - 6) +
                ',' +
                outText.slice(outText.length - 6, outText.length - 3) +
                ',' +
                outText.slice(outText.length - 3);
        }
    }
    return outText;
}

// add style class for hovering over operator buttons
function addOpHover(e) {
    return e.currentTarget.classList.add('operatorHover');
}
// remove style class for hovering over operator buttons
function removeOpHover(e) {
    return e.currentTarget.classList.remove('operatorHover');
}

// operator click function
function opClick(e) {
    const operator = e.currentTarget.textContent;
    let currVal = parseInt(output.textContent.replace(/,|\./g, ''));

    console.log(`currVal = ${currVal}`);

    // only calculate if there is a previous operator 
    if ((hasClickedNum || operator === '=') && prevOperator !== '') {
        // calculate and add to accumulator
        if (!hasClickedNum) {
            accumulator = operate(prevOperator, currVal, prevVal);
        } else {
            accumulator = operate(prevOperator, prevVal, currVal);
        }

        if (accumulator.toString().length > 10) {
            output.textContent = insertComma(roundNumber(accumulator, 8)
                .toString());
        } else {
            output.textContent = insertComma(accumulator.toString());
        }
    } 

    console.log(`accumulator = ${accumulator}`);

    // only sets the previous value if a numnber has been clicked
    if ((!hasClickedNum || prevVal !== null) && operator !== '=' && accumulator !== null) {
        prevVal = accumulator;
    } else if (hasClickedNum) {
        prevVal = currVal;
    }

    console.log(`prevVal = ${prevVal}`);

    // css style removal
    removePrevOpStyle();

    if (operator !== '=') {
        e.currentTarget.classList.add('operatorClick'); // add click style
        prevOperator = operator;
        hasClickedOp = true; 
    } 
    
    hasClickedNum = false; // after clicking an operator 
}

// remove operatorClick style class (after a number is clicked)
function removePrevOpStyle() {
    let clickedOp;
    if (prevOperator !== '' && prevOperator !== '=') {
        if(prevOperator === '+'){
            clickedOp = document.querySelector('.add');
        } else if(prevOperator === '–'){
            clickedOp = document.querySelector('.subtract');
        } else if(prevOperator === '×'){
            clickedOp = document.querySelector('.multiply');
        } else if(prevOperator === '÷'){
            clickedOp = document.querySelector('.divide');
        }
        clickedOp.classList.remove('operatorClick');
    }
}

// number click function
function numClick(e) {
    const numText = e.target.textContent;
    let outText = output.textContent;
    hasClickedNum = true;

    // if the output text is 0 or an operator has been clicked, 
    // then replace the output, otherwise append to it
    if (outText === '0' || hasClickedOp) {
        hasClickedOp = false;
        output.textContent = numText; 
    } else if (outText.replace(/,|\.|-/g, '').length < 9) {
        outText += numText;
        output.textContent = insertComma(outText);
    }

    removePrevOpStyle();
}

// reset calculator
function allClear() {
    document.querySelector('.output').textContent = 0;
    replaceDecimalListener();
    removePrevOpStyle();
    prevOperator = '';
    prevVal = null;
    accumulator = null;
    hasClickedOp = false;
    hasClickedNum = false;
}

function roundNumber(number, digits) {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}

const output = document.querySelector('.output');
const clearBtn = document.querySelector('.clear');
const numBtns = document.querySelectorAll('.number');
const opBtns = document.querySelectorAll('.operator');
let prevVal = null; 
let prevOperator = '';
let accumulator = null;
let hasClickedOp = false;
let hasClickedNum = false;

replaceDecimalListener();

// clear button event listener
clearBtn.addEventListener('click', allClear);

// number event listeners
numBtns.forEach(numBtn => {
    numBtn.addEventListener('click', numClick);
});

// operator event listeners
opBtns.forEach(opBtn => { 
    opBtn.addEventListener('mouseover', addOpHover);
    opBtn.addEventListener('mouseleave', removeOpHover);
    opBtn.addEventListener('click', opClick);
});