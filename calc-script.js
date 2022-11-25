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

const numBtns = document.querySelectorAll('.number');


numBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        const output = document.querySelector('.output');
        const decFlag = output.textContent.includes('.');
        const numText = e.target.textContent;
        let outText = output.textContent.replace(/,/g, '');

        if (outText === '0') {
            outText = numText; 
        } else if (outText.length < 9) {
            outText += numText;
        }

        // inserts comma for every third character
        if (outText.length > 3 && outText.length <= 6) {
            outText = outText.slice(0, outText.length-3) + 
                ',' + 
                outText.slice(outText.length-3);
        } else if (outText.length > 6) {
            outText = outText.slice(0, outText.length-6) + 
                ',' + 
                outText.slice(outText.length-6, outText.length-3) + 
                ',' +
                outText.slice(outText.length-3);
        }

        output.textContent = outText;
    })
});