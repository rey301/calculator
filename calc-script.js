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
      return (divideByZero = true);
    } else {
      return num1 / num2;
    }
  }
  
  function operate(operator, num1, num2) {
    switch (operator) {
      case "+":
        return add(num1, num2);
      case "–":
        return subtract(num1, num2);
      case "×":
        return multiply(num1, num2);
      case "÷":
        return divide(num1, num2);
      default:
        return "Error: invalid operator";
    }
  }
  
  // Replace decimal event listener; so that it can only be clicked once
  function replaceDecimalListener() {
    const oldBtn = document.querySelector(".decimal");
    const newBtn = oldBtn.cloneNode(true);
  
    newBtn.addEventListener(
      "click",
      function cb(e) {
        if (hasClickedOp) {
          hasClickedOp = false;
          outputDiv.textContent = "0.";
        } else if (outputDiv.textContent.replace(/,|\./g, "").length < 9) {
          outputDiv.textContent += e.target.textContent;
        }
        e.currentTarget.removeEventListener(e.type, cb);
      },
      { once: true }
    );
  
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  }
  
  // Inserts comma for every third character
  function insertComma(outText) {
    let isDecimal = false;
  
    if (outText.includes(".")) {
      isDecimal = true;
      outTextSplit = outText.split(".");
      outText = outTextSplit[0];
    }
  
    if (!outText.includes("e")) {
      outText = outText.replace(/,/g, "");
      if (
        outText.replace(/-/g, "").length > 3 &&
        outText.replace(/-/g, "").length <= 6
      ) {
        outText =
          outText.slice(0, outText.length - 3) +
          "," +
          outText.slice(outText.length - 3);
      } else if (outText.replace(/-/g, "").length > 6) {
        outText =
          outText.slice(0, outText.length - 6) +
          "," +
          outText.slice(outText.length - 6, outText.length - 3) +
          "," +
          outText.slice(outText.length - 3);
      }
    }
  
    return isDecimal ? `${outText}.${outTextSplit[1]}` : outText;
  }
  
  // Add style class for hovering over operator buttons
  function addOpHover(e) {
    return e.currentTarget.classList.add("operatorHover");
  }
  // Remove style class for hovering over operator buttons
  function removeOpHover(e) {
    return e.currentTarget.classList.remove("operatorHover");
  }
  
  // Operator click function
  function opClick(e) {
    const operator = e.currentTarget.textContent;
    let currVal = parseFloat(outputDiv.textContent.replace(/,/g, ""));
    replaceDecimalListener(); // allow decimal button to be pressed again
    removePrevOpStyle(); // css style removal
  
    // Only calculate if there was a previous operator,
    // and has clicked a number / equals button
    if (
      (hasClickedNum || operator === "=") &&
      prevOperator !== null &&
      !smallLimit
    ) {
      // Calculate and add to accumulator
      hasClickedNum
        ? (accumulator = operate(prevOperator, prevVal, currVal))
        : (accumulator = operate(prevOperator, currVal, prevVal));
  
      if (accumulator === Infinity && !largeLimit) {
        largeLimit = true;
      }
  
      if (divideByZero || smallLimit || largeLimit) {
        outputDiv.textContent = "Error";
      } else if (accumulator.toString().length > 9 && accumulator > 999999999) {
        // Handles very large numbers
        const accExp = accumulator.toExponential();
        const accumulatorSplit = accExp.toString().split("e");
  
        // Round the number if the length is too long to fit the output
        accExp.toString().length > 9
          ? (outputDiv.textContent =
              `${roundNumber(
                parseFloat(accumulatorSplit[0]),
                8 - accumulatorSplit[1].length
              )}` + `e${parseFloat(accumulatorSplit[1])}`)
          : (outputDiv.textContent =
              `${parseFloat(accumulatorSplit[0])}` +
              `e${parseFloat(accumulatorSplit[1])}`);
      } else if (accumulator.toString().includes("e")) {
        // Handles very small numbers
        handlerArr = smallNumHandler(accumulator, smallLimit);
        outputDiv.textContent = handlerArr[0];
        smallLimit = handlerArr[1];
      } else if (
        accumulator.toString().length > 10 &&
        accumulator.toString().includes(".")
      ) {
        // Round to the nearest whole integer if the length is too long
        accumulator.toString().split(".")[0].length > 8
          ? (outputDiv.textContent = insertComma(
              Math.round(accumulator).toString()
            ))
          : (outputDiv.textContent = insertComma(
              roundNumber(
                accumulator,
                accumulator.toString().split(".")[1].length -
                  (accumulator.toString().length - 10)
              ).toString()
            ));
      } else {
        outputDiv.textContent = insertComma(accumulator.toString());
      }
    }
  
    if (
      (!hasClickedNum || prevVal !== null) &&
      operator !== "=" &&
      accumulator !== null
    ) {
      prevVal = accumulator;
    } else if (hasClickedNum) {
      prevVal = currVal;
    }
  
    if (operator !== "=") {
      e.currentTarget.classList.add("operatorClick"); // add click style
      prevOperator = operator;
    }
  
    hasClickedOp = true;
    hasClickedNum = false;
  }
  
  // Remove operatorClick style class (after a number/equals button is clicked)
  function removePrevOpStyle() {
    let clickedOp = null;
  
    if (prevOperator === "+") {
      clickedOp = document.querySelector(".add");
    } else if (prevOperator === "–") {
      clickedOp = document.querySelector(".subtract");
    } else if (prevOperator === "×") {
      clickedOp = document.querySelector(".multiply");
    } else if (prevOperator === "÷") {
      clickedOp = document.querySelector(".divide");
    }
  
    if (clickedOp !== null) {
      clickedOp.classList.remove("operatorClick");
    }
  }
  
  // Number click function
  function numClick(e) {
    const numText = e.target.textContent;
    let outText = outputDiv.textContent;
    hasClickedNum = true;
  
    // Replace the output or append to it
    if (outText === "0" || hasClickedOp || hasClickedPerc) {
      hasClickedOp = false;
      hasClickedPerc = false;
      outputDiv.textContent = numText;
    } else if (outText.replace(/,|\.|-/g, "").length < 9) {
      outText += numText;
      outputDiv.textContent = insertComma(outText);
    }
  
    removePrevOpStyle();
  }
  
  // Percentage button click function
  function percClick() {
    if (!hasClickedPerc) {
      hasClickedPerc = true;
      percVal = parseFloat(outputDiv.textContent.replace(/,/g, ""));
    }
  
    if (!smallLimit) {
      percVal = percVal / 100;
  
      // Handles very small numbers
      handlerArr = smallNumHandler(percVal, smallLimit);
      smallLimit = handlerArr[1];
      outputDiv.textContent = handlerArr[0];
    }
  }
  
  // Sign button click function
  function signClick() {
    if (outputDiv.textContent !== "0") {
      if (outputDiv.textContent.includes("-")) {
        outputDiv.textContent = outputDiv.textContent.split("-")[1];
      } else {
        outputDiv.textContent = `-${outputDiv.textContent}`;
      }
    }
  }
  
  // Reduces the length of small numbers to fit the calculator output
  function smallNumHandler(num, limit) {
    let outputString = "";
    const numSplit = num.toString().split("e");
  
    if (num.toString().includes("e")) {
      // Round the number if the length is bigger than 11
      num.toString().length > 11
        ? (outputString =
            `${roundNumber(
              parseFloat(numSplit[0]),
              9 - numSplit[1].length - 1
            )}` + `e${parseFloat(numSplit[1])}`)
        : (outputString =
            `${parseFloat(numSplit[0])}` + `e${parseFloat(numSplit[1])}`);
    } else if (num.toString().length > 10) {
      outputString = roundNumber(num, 8).toString();
    } else {
      outputString = num.toString();
    }
  
    if (numSplit[1] < -100) {
      outputString = "Error";
      limit = true;
    } else {
      outputString = insertComma(outputString);
    }
  
    return [outputString, limit];
  }
  
  // Reset calculator
  function allClear() {
    document.querySelector(".output").textContent = 0;
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
    largeLimit = false;
  }
  
  // Round number by the number of digits
  function roundNumber(number, digits) {
    var multiple = Math.pow(10, digits);
    var roundNum = Math.round(number * multiple) / multiple;
    return roundNum;
  }
  
  const outputDiv = document.querySelector(".output");
  const clearBtn = document.querySelector(".clear");
  const percBtn = document.querySelector(".percentage");
  const signBtn = document.querySelector(".sign");
  const numBtns = document.querySelectorAll(".number");
  const opBtns = document.querySelectorAll(".operator");
  let prevVal = null;
  let prevOperator = null;
  let accumulator = null;
  let percVal = null;
  let hasClickedPerc = false;
  let hasClickedOp = false;
  let hasClickedNum = false;
  let divideByZero = false;
  let smallLimit = false;
  let largeLimit = false;
  
  replaceDecimalListener(); // adds click function to decimal button
  clearBtn.addEventListener("click", allClear); // clear button event listener
  percBtn.addEventListener("click", percClick); // percent button event listener
  signBtn.addEventListener("click", signClick); // sign button event listener
  
  // Number event listeners
  numBtns.forEach((numBtn) => numBtn.addEventListener("click", numClick));
  
  // Operator event listeners
  opBtns.forEach((opBtn) => {
    opBtn.addEventListener("mouseover", addOpHover);
    opBtn.addEventListener("mouseleave", removeOpHover);
    opBtn.addEventListener("click", opClick);
  });