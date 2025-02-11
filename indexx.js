const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatepassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+{[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

// Set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
   // not worked
    // const min = inputSlider.min;
    // const max = inputSlider.max;
    // lengthSlider.style.backgroundSize =
    //   ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRandomIntger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return String.fromCharCode(getRandomIntger(48, 58)); // ASCII values for 0-9
}

function generateLowercase() {
    return String.fromCharCode(getRandomIntger(97, 123)); // ASCII values for a-z
}

function generateUppercase() {
    return String.fromCharCode(getRandomIntger(65, 91)); // ASCII values for A-Z
}

function generatesymbol() {
    const randNum = getRandomIntger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNumber = numberCheck.checked;
    let hasSymbol = symbolCheck.checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0"); // Green
    } else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0"); // Yellow
    } else {
        setIndicator("#f00"); // Red
    }
}

async function copyContent() {
    try {
        // throw error if password is empty
        if(password === ""){
            alert('First Generate Password to copy');
            throw 'Failed'; 
        }

        await navigator.clipboard.writeText(password);
        copyMsg.innerText = "Copied";
    } 

    // catch() will only run if any error is thrown by the try block
    catch (error) {
      copyMsg.innerText = error;
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
      copyMsg.classList.remove("active");
    }, 2000);
}
  
copyBtn.addEventListener("click", () => {
    // if (password) copyContent();
    copyContent();
});

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join("");
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // Special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
    if (checkCount === 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Generate password
    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUppercase);
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowercase);
    }
    console.log(lowercaseCheck);

    
    if (numberCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolCheck.checked) funcArr.push(generatesymbol);

    // Compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Additional addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomIntger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Display password
    passwordDisplay.value = password;

    // Calculate strength
    calcStrength();
});
