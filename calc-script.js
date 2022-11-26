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

        case '&times':
            return multiply(num1, num2);

        case '&divide':
            return divide(num1, num2);

        default: 
            return "Error: invalid arguments";
    }
}

// remove and add decimal event listener; can only be clicked once
function replaceDecimalListener() {
    const oldBtn = document.querySelector('.decimal');
    const newBtn = oldBtn.cloneNode(true);

    newBtn.addEventListener('click', function cb(e) {
        if (output.textContent.replace(/,|\./g, '').length < 9) {
            output.te
            xtContent += e.target.textContent;
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

// event listener methods
function addOpHover(e) {
    return e.currentTarget.classList.add('operatorHover');
}

function removeOpHover(e) {
    return e.currentTarget.classList.remove('operatorHover');
}

function clickOperator(e) {
    e.currentTarget.removeEventListener('mouseover', addOpHover);
    e.currentTarget.removeEventListener('mouseleave', removeOpHover);
    e.currentTarget.classList.remove('operatorHover');
    e.currentTarget.classList.add('operatorClick');
}

const output = document.querySelector('.output');
const clearBtn = document.querySelector('.clear');
const numBtns = document.querySelectorAll('.number');
const opBtns = document.querySelectorAll('.operator');

replaceDecimalListener();

clearBtn.addEventListener('click', () => {
    document.querySelector('.output').textContent = 0;
    replaceDecimalListener();
});

numBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        const numText = e.target.textContent;
        let outText = output.textContent;

        if (outText === '0') {
            return output.textContent = numText; 
        } else if (outText.replace(/,|\./g, '').length < 9) {
            outText += numText;
        }

        output.textContent = insertComma(outText);
    })
});

opBtns.forEach(opBtn => { 
    opBtn.addEventListener('mouseover', addOpHover);
    opBtn.addEventListener('mouseleave', removeOpHover);
    opBtn.addEventListener('click', clickOperator);
});