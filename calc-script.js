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

// add decimal event listener; can only be clicked once
function addDecimalListener() {
    const decBtn = document.querySelector('.decimal');
    decBtn.addEventListener('click', e => {
        document.querySelector('.output').textContent += e.target.textContent;
        console.log(e); 
    }, {once: true});

    // removes click event
    decBtn.addEventListener('click', function cb(e) {
        e.currentTarget.removeEventListener(e.type, cb);
    });
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

const output = document.querySelector('.output');
const clearBtn = document.querySelector('.clear');
const numBtns = document.querySelectorAll('.number');

clearBtn.addEventListener('click', () => {
    document.querySelector('.output').textContent = 0;
    addDecimalListener();
});

addDecimalListener();

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

