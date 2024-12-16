let score = 0;
let attempts = 0;
let numbers = generateNewNumbers();
const buttons = document.querySelectorAll('.game-button');

function generateNewNumbers() {
    return {
        num1: Math.floor(Math.random() * 100) + 1,
        num2: Math.floor(Math.random() * 100) + 1
    };
}

function updateDisplay() {
    document.getElementById('number1').textContent = numbers.num1;
    document.getElementById('number2').textContent = numbers.num2;
    document.getElementById('score').textContent = score;
    const accuracy = attempts > 0 ? ((score / attempts) * 100).toFixed(1) : '0';
    document.getElementById('accuracy').textContent = accuracy;
}

function showFeedback(message, isSuccess) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback ${isSuccess ? 'success' : 'error'}`;
    
    // Disable buttons during feedback
    buttons.forEach(button => button.disabled = true);

    // Hide feedback and enable buttons after delay
    setTimeout(() => {
        feedbackElement.className = 'feedback hidden';
        buttons.forEach(button => button.disabled = false);
        numbers = generateNewNumbers();
        updateDisplay();
    }, 1500);
}

function handleAnswer(answer) {
    attempts++;
    let isCorrect = false;

    if (numbers.num1 < numbers.num2 && answer === '<') {
        isCorrect = true;
    } else if (numbers.num1 > numbers.num2 && answer === '>') {
        isCorrect = true;
    } else if (numbers.num1 === numbers.num2 && answer === '=') {
        isCorrect = true;
    }

    if (isCorrect) {
        score++;
        showFeedback('Točno! 🎉', true);
    } else {
        showFeedback('Netočno! Pokušaj ponovno! 😕', false);
    }

    updateDisplay();
}

function resetGame() {
    score = 0;
    attempts = 0;
    numbers = generateNewNumbers();
    updateDisplay();
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.className = 'feedback hidden';
}

// Initialize the game
updateDisplay();
