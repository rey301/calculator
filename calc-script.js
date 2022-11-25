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

const decBtn = document.querySelector('.decimal');
const clearBtn = document.querySelector('.clear');
clearBtn.addEventListener('click', () => {
    document.querySelector('.output').textContent = 0;
    decBtn.addEventListener('click', e => {
        document.querySelector('.output').textContent += e.target.textContent;
        console.log(e); 
    }, {once: true});

    decBtn.addEventListener('click', function cb(e) {
        e.currentTarget.removeEventListener(e.type, cb);
    });
});
    
decBtn.addEventListener('click', e => {
    document.querySelector('.output').textContent += e.target.textContent;
    console.log(e); 
}, {once: true});

// removes click event
decBtn.addEventListener('click', function cb(e) {
    e.currentTarget.removeEventListener(e.type, cb);
});

const numBtns = document.querySelectorAll('.number');
numBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        const output = document.querySelector('.output');
        const numText = e.target.textContent;
        let outText = output.textContent;

        if (outText === '0') {
            return output.textContent = numText; 
        } else if (outText.replace(/,|\./g, '').length < 9) {
            outText += numText;
        }

        // inserts comma for every third character
        if (!outText.includes('.')) {
            outText = outText.replace(/,/g, '');
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
        }
        
        output.textContent = outText;
    })
});