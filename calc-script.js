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
    if ((hasClickedNum || operator === '=') && prevOperator !== null 
    && !smallLimit) {
        // calculate and add to accumulator
        hasClickedNum ? 
            accumulator = operate(prevOperator, prevVal, currVal) : 
            accumulator = operate(prevOperator, currVal, prevVal);

        if (divideByZero) {
            outputDiv.textContent = 'Error';
        // round the number if the length is too long to fit the output
        } else if (accumulator.toString().length > 9
        && accumulator > 999999999) {
            const accExp = accumulator.toExponential();
            const accumulatorSplit = accExp
                .toString()
                .split('e');

            accExp.toString().length > 9 ?
                outputDiv.textContent = 
                    `${roundNumber(parseFloat(accumulatorSplit[0]), 
                        8 - accumulatorSplit[1].length)}` + 
                    `e${parseFloat(accumulatorSplit[1])}` :
                outputDiv.textContent =`${parseFloat(accumulatorSplit[0])}` + 
                `e${parseFloat(accumulatorSplit[1])}`;
        
        } else if (accumulator.toString().includes('e')) {
            handlerArr = smallNumHandler(accumulator, smallLimit);
            outputDiv.textContent = handlerArr[0];
            smallLimit = handlerArr[1];
        } else if (accumulator.toString().length > 10 
        && accumulator.toString().includes('.')) {
            console.log(accumulator);
            if (accumulator.toString().split('.')[0].length > 8) {
                outputDiv.textContent = insertComma(Math.round(accumulator)
                    .toString());
            } else {
                outputDiv.textContent = 
                    insertComma(roundNumber(accumulator, 
                        accumulator.toString().split('.')[1].length - 
                        (accumulator.toString().length - 10))
                    .toString());
            }
        } else {
            outputDiv.textContent = insertComma(accumulator.toString());
        }        
    } else if (smallLimit) {
        outputDiv.textContent = 'Error';
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
    } 

    removePrevOpStyle();
}

function percClick(e) {
    if (!hasClickedPerc) {
        hasClickedPerc = true;
        percVal = parseFloat(outputDiv.textContent.replace(/,/g, ''));
    }

    if (!smallLimit) {
        percVal = percVal / 100;
        handlerArr = smallNumHandler(percVal, smallLimit);
        smallLimit = handlerArr[1];
        outputDiv.textContent = handlerArr[0];
    }
}

function smallNumHandler(num, limit) {
    let outputString = '';
    const numSplit = num.toString().split('e');

    if (num.toString().includes('e')) {
        // Round the number if the length is bigger than 9
        num.toString().length > 11 ?
            outputString = `${roundNumber(parseFloat(numSplit[0]), 
                    (9 - numSplit[1].length) - 1)}`
                + `e${parseFloat(numSplit[1])}` :
            outputString = `${parseFloat(numSplit[0])}`
                + `e${parseFloat(numSplit[1])}`;

    } else if (num.toString().length > 10) {
        outputString = roundNumber(num, 8).toString();
    } else {
        outputString = num.toString();
    }

    if (numSplit[1] < -100) {
        outputString = 'Error';
        limit = true;
    } else { 
        outputString = insertComma(outputString);
    }

    return [outputString, limit];
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
    smallLimit = false;
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
let percVal = null;
let hasClickedPerc = false;
let hasClickedOp = false;
let hasClickedNum = false;
let divideByZero = false;
let smallLimit = false;

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