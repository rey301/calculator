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
        if (outText.length > 3 && outText.length <= 6) {
            outText = outText.slice(0, outText.length - 3) +
                ',' +
                outText.slice(outText.length - 3);
        } else if (outText.length > 6) {
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
    
    // remove any other operatorClick class styles and apply it to the current
    if (operator !== '=') {
        opBtns.forEach(opBtn => {
            if (operator !== opBtn.textContent) {
                if (opBtn.classList.contains('operatorClick')) {
                    opBtn.classList.remove('operatorClick');
                }
            }
        });
        e.currentTarget.classList.add('operatorClick');
    }   

    // operations
    if (operator === '=') {
        if (prevOperator !== '') {
            currVal = parseInt(output.textContent.replace(/,|\./g, ''));
            accumulator = operate(prevOperator, prevVal, currVal);
            output.textContent = insertComma(accumulator.toString());
        }
    } else {
        prevVal = parseInt(output.textContent.replace(/,|\./g, ''));
        prevOperator = operator;
        hasClickedOp = true;
    }
}

// number click function
function numClick(e) {
    const numText = e.target.textContent;
    let outText = output.textContent;

    // if the output text is 0 or an operator has been clicked, 
    // then replace the output, otherwise append to it
    if (outText === '0' || hasClickedOp) {
        hasClickedOp = false;
        output.textContent = numText; 
    } else if (outText.replace(/,|\./g, '').length < 9) {
        outText += numText;
        output.textContent = insertComma(outText);
    }

    let clickedOp;

    // remove operatorClick style class (after a number is clicked)
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

// reset calculator
function allClear() {
    document.querySelector('.output').textContent = 0;
    replaceDecimalListener();
    prevOperator = '';
    accumulator = 0;
    hasClickedOp = false;
}

const output = document.querySelector('.output');
const clearBtn = document.querySelector('.clear');
const numBtns = document.querySelectorAll('.number');
const opBtns = document.querySelectorAll('.operator');
let prevVal = 0; 
let prevOperator = '';
let accumulator = 0;
let hasClickedOp = false;

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