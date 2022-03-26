const strengthMeter = document.getElementById('strength-meter');
const passwordInput = document.getElementById('password-input');
const reasonsContainer = document.getElementById('reasons');

passwordInput.addEventListener('input', updateStrengthMeter);
updateStrengthMeter();

function updateStrengthMeter() {
    const weaknesses = calPassStrength(passwordInput.value);
    let strength = 100;

    reasonsContainer.innerHTML = '';
    weaknesses.forEach((weakness) => {
        if (weakness === undefined || weakness === null) return;

        strength -= weakness.deduction;
        const messageEl = document.createElement('div');
        messageEl.innerText = weakness.message;
        reasonsContainer.appendChild(messageEl);
    });

    strengthMeter.style.setProperty('--strength', strength);
}

function calPassStrength(password) {
    const weaknesses = [];
    
    weaknesses.push(lengthWeakness(password));
    weaknesses.push(lowercaseWeakness(password));
    weaknesses.push(uppercaseWeakness(password));
    weaknesses.push(numberWeakness(password));
    weaknesses.push(specialWeakness(password));
    weaknesses.push(repeatCharsWeakness(password));
    weaknesses.push(securePass(weaknesses));

    return weaknesses;
}

function lengthWeakness(password) {
    const length = password.length;

    if (length <= 5) {
        return {
            message: 'Your password is too short!',
            // How much it affects the strength meter
            deduction: 40
        };
    }

    if (length <= 10) {
        return {
            message: 'Your password could be longer!',
            deduction: 15
        };
    }
}

function lowercaseWeakness(password) {
    // /[a-z]/g
    return charTypeWeakness(password, /[a-z]/g, 'Lowercase');
}

function uppercaseWeakness(password) {
    // /[A-Z]/g
    return charTypeWeakness(password, /[A-Z]/g, 'Uppercase');
}

function numberWeakness(password) {
    // /[0-9]/g
    return charTypeWeakness(password, /[0-9]/g, 'Numbers');
}

function specialWeakness(password) {
    //* ^ means not anything in the list
    //* \s means any form of white space
    // /[^0-9a-zA-Z\s]/g
    return charTypeWeakness(password, /[^0-9a-zA-Z\s]/g, 'Special');
}

function charTypeWeakness(password, regex, type) {
    const matches = password.match(regex) || [];

    if (matches.length === 0) {
        return {
            message: `Your password has no ${type} characters!`,
            deduction: 20
        };
    }

    if (matches.length <= 2) {
        return {
            message: `Your password could use more ${type} characters!`,
            deduction: 5
        };
    }
}

function repeatCharsWeakness(password) {
    //* (.) means a group of any chars
    //* \1 means whatever first group
    const matches = password.match(/(.)\1/g) || [];

    if (matches.length > 0) {
        return {
            message: 'Your password has Repeat characters!',
            deduction: matches.length * 10
        };
    }
}

function securePass(weaknesses) {
    if (weaknesses.every((val) => val === undefined)) {
        return {
            message: 'Your Password is SECURED!',
            deduction: 0
        };
    }
}
