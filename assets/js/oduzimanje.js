document.addEventListener('DOMContentLoaded', function() {
    let firstNumber, secondNumber, correctAnswer;
    let score = 0;
    let totalQuestions = 0;
    let isMultipleChoice = true;
    let maxNumber = 20;

    const taskElement = document.getElementById('task');
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback');
    const optionsContainer = document.getElementById('options');
    const userInput = document.getElementById('userInput');
    const inputContainer = document.getElementById('inputContainer');
    const toggleInputButton = document.getElementById('toggleInput');
    const printButton = document.getElementById('print');
    const hintButton = document.getElementById('hint');
    const nextButton = document.getElementById('next');
    const printArea = document.getElementById('printArea');

    function generateTask() {
        do {
            firstNumber = Math.floor(Math.random() * (maxNumber + 1));
            secondNumber = Math.floor(Math.random() * (firstNumber + 1));
        } while (firstNumber - secondNumber > maxNumber || firstNumber === secondNumber);

        correctAnswer = firstNumber - secondNumber;
        taskElement.textContent = `${firstNumber} - ${secondNumber} = `;
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';

        if (isMultipleChoice) {
            generateOptions();
            optionsContainer.style.display = 'grid';
            inputContainer.style.display = 'none';
        } else {
            optionsContainer.style.display = 'none';
            inputContainer.style.display = 'flex';
            userInput.value = '';
            userInput.focus();
        }
    }

    function generateOptions() {
        optionsContainer.innerHTML = '';
        const answers = [correctAnswer];
        
        while (answers.length < 4) {
            const randomAnswer = Math.floor(Math.random() * (maxNumber + 1));
            if (!answers.includes(randomAnswer)) {
                answers.push(randomAnswer);
            }
        }

        // Shuffle answers
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = answer;
            button.addEventListener('click', () => checkAnswer(answer));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(userAnswer) {
        totalQuestions++;
        const isCorrect = parseInt(userAnswer) === correctAnswer;

        if (isCorrect) {
            score++;
            feedbackElement.textContent = 'Tačno! 🎉';
            feedbackElement.className = 'feedback correct';
        } else {
            feedbackElement.textContent = `Netačno. Tačan odgovor je ${correctAnswer}`;
            feedbackElement.className = 'feedback incorrect';
        }

        updateScore();
        saveProgress();

        // Disable all option buttons after answer
        if (isMultipleChoice) {
            const buttons = optionsContainer.getElementsByClassName('option-button');
            Array.from(buttons).forEach(button => {
                button.disabled = true;
                if (parseInt(button.textContent) === correctAnswer) {
                    button.style.backgroundColor = '#4CAF50';
                    button.style.color = 'white';
                } else if (parseInt(button.textContent) === parseInt(userAnswer)) {
                    button.style.backgroundColor = '#f44336';
                    button.style.color = 'white';
                }
            });
        }

        nextButton.style.display = 'block';
    }

    function updateScore() {
        const percentage = (score / totalQuestions * 100).toFixed(1);
        scoreElement.textContent = `Rezultat: ${score}/${totalQuestions} (${percentage}%)`;
    }

    function saveProgress() {
        if (typeof ajaxurl !== 'undefined' && typeof nonce !== 'undefined') {
            const data = {
                action: 'save_oduzimanje_progress',
                score: score,
                total: totalQuestions,
                _ajax_nonce: nonce
            };

            fetch(ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data)
            })
            .catch(error => console.error('Error saving progress:', error));
        }
    }

    function toggleInputMode() {
        isMultipleChoice = !isMultipleChoice;
        toggleInputButton.textContent = isMultipleChoice ? 'Prebaci na unos' : 'Prebaci na izbor';
        generateTask();
    }

    function showHint() {
        const steps = [
            `1. Počnimo od ${firstNumber}`,
            `2. Trebamo oduzeti ${secondNumber}`,
            `3. Možemo brojati unazad od ${firstNumber} za ${secondNumber}`,
            `4. Ili možemo koristiti brojevnu liniju`,
            `5. Odgovor je ${correctAnswer}`
        ];
        feedbackElement.textContent = steps.join('\n');
        feedbackElement.className = 'feedback hint';
    }

    function printTasks() {
        const printWindow = window.open('', '', 'width=800,height=600,top=50,left=50,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Zadaci za vježbanje oduzimanja</title>
                <style>
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                    body {
                        font-family: 'Comic Neue', Arial, sans-serif;
                        line-height: 1.6;
                    }
                    h2 {
                        text-align: center;
                        color: #4CAF50;
                        margin-bottom: 30px;
                    }
                    .print-task {
                        font-size: 16pt;
                        margin: 30px 0;
                        page-break-inside: avoid;
                    }
                </style>
            </head>
            <body>
                <h2>Zadaci za vježbanje oduzimanja</h2>
                <div id="printContent"></div>
            </body>
            </html>
        `);

        const printContent = printWindow.document.getElementById('printContent');
        
        for (let i = 0; i < 20; i++) {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'print-task';
            
            let a, b;
            do {
                a = Math.floor(Math.random() * (maxNumber + 1));
                b = Math.floor(Math.random() * (a + 1));
            } while (a - b > maxNumber || a === b);

            taskDiv.textContent = `${a} - ${b} = ____`;
            printContent.appendChild(taskDiv);
        }

        let printDialogClosed = false;
        const checkPrintDialog = setInterval(() => {
            if (!printDialogClosed && !printWindow.document.hasFocus()) {
                printWindow.close();
                clearInterval(checkPrintDialog);
            }
        }, 100);

        // Clear interval after 10 seconds to prevent memory leaks
        setTimeout(() => {
            clearInterval(checkPrintDialog);
        }, 10000);

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };

        // Trigger onload since we're using document.write
        printWindow.document.close();
    }

    // Event Listeners
    toggleInputButton.addEventListener('click', toggleInputMode);
    printButton.addEventListener('click', printTasks);
    hintButton.addEventListener('click', showHint);
    nextButton.addEventListener('click', () => {
        generateTask();
        nextButton.style.display = 'none';
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer(userInput.value);
        }
    });

    // Initialize
    generateTask();
});
