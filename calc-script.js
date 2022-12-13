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
    if (num2 == 0) {
        return divideByZero = true;
    } else {
        return num1 / num2;
    }
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
        if (hasClickedOp) {
            hasClickedOp = false;
            outputDiv.textContent = '0.'; 
        } else if (outputDiv.textContent.replace(/,|\./g, '').length < 9) {
            outputDiv.textContent += e.target.textContent;
        }
        e.currentTarget.removeEventListener(e.type, cb);
    }, {once: true});

    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
}

// inserts comma for every third character
function insertComma(outText) {
    let isDecimal = false;

    if (outText.includes('.')) {
        isDecimal = true;
        outTextSplit = outText.split('.');
        outText = outTextSplit[0];
    }

    if (!outText.includes('e')) {
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

    return isDecimal ? `${outText}.${outTextSplit[1]}` : outText;
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
    let currVal = parseFloat(outputDiv.textContent.replace(/,/g, ''));
    replaceDecimalListener(); // allow decimal button to be pressed again
    removePrevOpStyle(); // css style removal

    // only calculate if there is a previous operator,
    // and has clicked a number / equals button
    if ((hasClickedNum || operator === '=') && prevOperator !== null) {
        // calculate and add to accumulator
        hasClickedNum ? 
            accumulator = operate(prevOperator, prevVal, currVal) : 
            accumulator = operate(prevOperator, currVal, prevVal);

        divideByZero ?
            outputDiv.textContent = 'Error' :
            // round the number if the length is too long to fit the output
            console.log(accumulator.toString().length);
            accumulator.toString().length > 10 ? 
                outputDiv.textContent = insertComma(roundNumber(accumulator, 8)
                    .toString()) :
                outputDiv.textContent = insertComma(accumulator.toString());
    }

    // only sets the previous value if a numnber has been clicked
    if ((!hasClickedNum || prevVal !== null) 
        && operator !== '=' 
        && accumulator !== null) {
            prevVal = accumulator;
    } else if (hasClickedNum) {
            prevVal = currVal;
    }

    if (operator !== '=') {
        e.currentTarget.classList.add('operatorClick'); // add click style
        prevOperator = operator;
    } 

    hasClickedOp = true; 
    hasClickedNum = false;
}

// remove operatorClick style class (after a number/equals button is clicked)
function removePrevOpStyle() {
    let clickedOp = null;

    if (prevOperator === '+') {
        clickedOp = document.querySelector('.add');
    } else if (prevOperator === '–') {
        clickedOp = document.querySelector('.subtract');
    } else if (prevOperator === '×') {
        clickedOp = document.querySelector('.multiply');
    } else if (prevOperator === '÷') {
        clickedOp = document.querySelector('.divide');
    }

    if (clickedOp !== null) {
        clickedOp.classList.remove('operatorClick');
    }
}

// number click function
function numClick(e) {
    const numText = e.target.textContent;
    let outText = outputDiv.textContent;
    hasClickedNum = true;

    // if the output text is 0 or an operator has been clicked, 
    // then replace the output, otherwise append to it
    if (outText === '0' || hasClickedOp || hasClickedPerc) {
        hasClickedOp = false;
        hasClickedPerc = false;
        outputDiv.textContent = numText; 
    } else if (outText.replace(/,|\.|-/g, '').length < 9) {
        outText += numText;
        outputDiv.textContent = insertComma(outText);
    } else {
        hasClickedNum = false;
    }

    removePrevOpStyle();
}

function percClick(e) {
    let percValString = '';

    if (!hasClickedPerc) {
        hasClickedPerc = true;
        percVal = parseFloat(outputDiv.textContent.replace(/,/g, ''));
    }

    if (!percLimit) {
        percVal = percVal / 100;
        const percValSplit = percVal.toString().split('e');

        if (percVal.toString().includes('e')) {
            percValSplit[0].length > 9 ?
                percValString = `${roundNumber(parseFloat(percValSplit[0]), 7)}`
                    + `e${parseFloat(percValSplit[1])}` :
                percValString = `${parseFloat(percValSplit[0])}`
                    + `e${parseFloat(percValSplit[1])}`;
        } else if (percVal.toString().length > 10) {
            percValString = roundNumber(percVal, 8).toString();
        } else {
            percValString = percVal.toString();
        }

        if (percValSplit[1] < -100) {
            outputDiv.textContent = 'Error';
            percLimit = true;
        } else { 
            outputDiv.textContent = insertComma(percValString);
        }
    }
}

// reset calculator
function allClear() {
    document.querySelector('.output').textContent = 0;
    replaceDecimalListener();
    removePrevOpStyle();
    prevOperator = null;
    prevVal = null;
    accumulator = null;
    originPercVal = null;
    percVal = null;
    hasClickedPerc = false;
    hasClickedOp = false;
    hasClickedNum = false;
    divideByZero = false;
    percLimit = false;
}

// round number by the number of digits
function roundNumber(number, digits) {
    var multiple = Math.pow(10, digits);
    var roundNum = Math.round(number * multiple) / multiple;
    return roundNum;
}

const outputDiv = document.querySelector('.output');
const clearBtn = document.querySelector('.clear');
const percBtn = document.querySelector('.percentage');
const numBtns = document.querySelectorAll('.number');
const opBtns = document.querySelectorAll('.operator');
let prevVal = null; 
let prevOperator = null;
let accumulator = null;
let originPercVal = null;
let percVal = null;
let hasClickedPerc = false;
let hasClickedOp = false;
let hasClickedNum = false;
let divideByZero = false;
let percLimit = false;

replaceDecimalListener(); // adds click function to decimal button
clearBtn.addEventListener('click', allClear); // clear button event listener
percBtn.addEventListener('click', percClick);

// number event listeners
numBtns.forEach(numBtn => numBtn.addEventListener('click', numClick));

// operator event listeners
opBtns.forEach(opBtn => { 
    opBtn.addEventListener('mouseover', addOpHover);
    opBtn.addEventListener('mouseleave', removeOpHover);
    opBtn.addEventListener('click', opClick);
});