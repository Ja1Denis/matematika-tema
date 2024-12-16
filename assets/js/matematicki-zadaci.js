document.addEventListener('DOMContentLoaded', function() {
    const currentNumber = document.getElementById('currentNumber');
    const numberAnswer = document.getElementById('numberAnswer');
    const userAnswer = document.getElementById('userAnswer');
    const checkAnswerButton = document.getElementById('checkAnswer');
    const newTaskButton = document.getElementById('newTask');
    const printTasksButton = document.getElementById('printTasks');
    const difficultySelect = document.getElementById('difficulty');
    const printPreview = document.getElementById('printPreview');
    const tasksList = document.getElementById('tasksList');
    const feedback = document.getElementById('feedback');
    const scoreValue = document.getElementById('scoreValue');

    let score = 0;

    // Konfiguracija za različite težine
    const difficultyConfig = {
        easy: { min: 1, max: 20, points: 1 },
        medium: { min: 20, max: 50, points: 2 },
        hard: { min: 50, max: 100, points: 3 }
    };

    // Funkcija za pretvaranje broja u tekst
    function numberToWords(num) {
        const jedinice = ['', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];
        const desetice = ['', 'deset', 'dvadeset', 'trideset', 'četrdeset', 'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'];
        const teens = ['deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'];

        if (num === 100) return 'sto';
        if (num === 0) return 'nula';

        let words = '';

        if (num >= 10 && num < 20) {
            return teens[num - 10];
        }

        const des = Math.floor(num / 10);
        const jed = num % 10;

        if (des > 0) {
            words += desetice[des];
        }

        if (jed > 0) {
            words += (words ? ' ' : '') + jedinice[jed];
        }

        return words;
    }

    // Funkcija za generiranje random broja
    function generateNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Funkcija za animaciju broja
    function animateNumber(number) {
        currentNumber.style.transform = 'scale(0.5)';
        currentNumber.style.opacity = '0';
        
        setTimeout(() => {
            currentNumber.textContent = number;
            currentNumber.style.transform = 'scale(1)';
            currentNumber.style.opacity = '1';
        }, 300);
    }

    // Provjera odgovora
    function checkAnswer() {
        const number = parseInt(currentNumber.textContent);
        const correctAnswer = numberToWords(number);
        const userText = userAnswer.value.trim().toLowerCase();
        const numberText = numberAnswer.value.trim();
        const difficulty = difficultySelect.value;
        const points = difficultyConfig[difficulty].points;

        let isCorrect = true;
        let feedbackHtml = '';

        // Provjeri broj
        if (numberText !== number.toString()) {
            isCorrect = false;
            feedbackHtml += `<div class="alert alert-danger">Netočan broj. Točan broj je: ${number}</div>`;
        }

        // Provjeri tekst
        if (userText !== correctAnswer) {
            isCorrect = false;
            feedbackHtml += `<div class="alert alert-danger">Netočno napisano. Točan odgovor je: ${correctAnswer}</div>`;
        }

        if (isCorrect) {
            score += points;
            feedbackHtml = '<div class="alert alert-success">Točno! 🎉 +' + points + ' bod(ova)</div>';
            setTimeout(generateNewTask, 1500);
        }

        feedback.innerHTML = feedbackHtml;
        scoreValue.textContent = score;
    }

    // Generiranje novog zadatka
    function generateNewTask() {
        const difficulty = difficultySelect.value;
        const config = difficultyConfig[difficulty];
        const number = generateNumber(config.min, config.max);
        animateNumber(number);
        numberAnswer.value = '';
        userAnswer.value = '';
        feedback.innerHTML = '';
    }

    // Generiranje liste zadataka za print
    function generatePrintTasks() {
        const difficulty = difficultySelect.value;
        const config = difficultyConfig[difficulty];
        let tasksHtml = `
            <div class="print-header">
                <h3 class="text-center mb-4">Zadaci za vježbu pisanja brojeva</h3>
                <p class="text-center mb-4">Težina: ${difficulty === 'easy' ? 'Lagano (1-20)' : 
                                                    difficulty === 'medium' ? 'Srednje (20-50)' : 
                                                    'Teško (50-100)'}</p>
            </div>
            <div class="print-tasks">`;

        // Generiraj 12 različitih brojeva
        const numbers = new Set();
        while(numbers.size < 12) {
            numbers.add(generateNumber(config.min, config.max));
        }

        // Kreiraj zadatke od generiranih brojeva
        Array.from(numbers).forEach((number, index) => {
            tasksHtml += `
                <div class="task-item mb-3">
                    <div class="task-number">${index + 1}.</div>
                    <span class="h4">Napiši kako se čita broj: ${number}</span>
                    <div class="answer-line"></div>
                </div>`;
        });

        tasksHtml += '</div>';

        // Postavi HTML i prikaži print preview
        if (tasksList) {
            tasksList.innerHTML = tasksHtml;
        }
        
        if (printPreview) {
            printPreview.classList.remove('d-none');
            
            // Scrollaj do print previewa
            printPreview.scrollIntoView({ behavior: 'smooth' });
            
            // Malo pričekaj prije pokretanja print dijaloga
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }

    // Event listeneri
    newTaskButton.addEventListener('click', generateNewTask);
    checkAnswerButton.addEventListener('click', checkAnswer);
    printTasksButton.addEventListener('click', generatePrintTasks);
    difficultySelect.addEventListener('change', generateNewTask);
    userAnswer.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Inicijalno generiranje zadatka
    generateNewTask();
});
