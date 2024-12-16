document.addEventListener('DOMContentLoaded', function() {
    let currentTask = null;
    let score = 0;
    let streak = 0;
    let difficulty = 'easy';

    // DOM elements
    const scoreElement = document.getElementById('score');
    const streakStarsElement = document.getElementById('streak-stars');
    const currentLevelElement = document.getElementById('current-level');
    const streakProgressElement = document.getElementById('streak-progress');
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer-input');
    const soundButton = document.getElementById('sound-btn');
    const feedbackElement = document.getElementById('feedback');
    const checkButton = document.getElementById('check-btn');
    const nextButton = document.getElementById('next-btn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const printButton = document.getElementById('print-worksheet');
    const printDifficultySelect = document.getElementById('print-difficulty');

    // Funkcija za generiranje random broja u rasponu
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Funkcija za pretvaranje brojeva u riječi
    function numberToWords(num) {
        const jedinice = ['', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];
        const desetice = ['', 'deset', 'dvadeset', 'trideset', 'četrdeset', 'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'];
        const posebni = ['deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'];
        const stotice = ['', 'sto', 'dvjesto', 'tristo', 'četiristo', 'petsto', 'šesto', 'sedamsto', 'osamsto', 'devetsto'];

        if (num === 0) return 'nula';
        if (num < 0) return 'minus ' + numberToWords(Math.abs(num));

        let words = '';

        // Stotice
        if (num >= 100) {
            words += stotice[Math.floor(num / 100)];
            num %= 100;
            if (num > 0) words += ' ';
        }

        // Posebni slučajevi za brojeve 11-19
        if (num >= 11 && num <= 19) {
            words += posebni[num - 10];
            return words;
        }

        // Desetice
        if (num >= 10) {
            words += desetice[Math.floor(num / 10)];
            num %= 10;
            if (num > 0) words += ' i ';
        }

        // Jedinice
        if (num > 0) {
            words += jedinice[num];
        }

        return words;
    }

    // Funkcija za generiranje zadataka
    function generateTask() {
        const ranges = {
            easy: { min: 1, max: 10 },
            medium: { min: 10, max: 99 },
            hard: { min: 100, max: 999 }
        };

        const range = ranges[difficulty];
        const number = getRandomNumber(range.min, range.max);

        currentTask = {
            number: number,
            answer: numberToWords(number)
        };

        questionElement.textContent = `Napiši broj ${number} riječima:`;
        answerInput.value = '';
        feedbackElement.className = 'feedback';
        feedbackElement.textContent = '';
        updateUI();
    }

    // Funkcija za generiranje radnog lista
    function generateWorksheet(selectedDifficulty) {
        const ranges = {
            easy: { min: 1, max: 10 },
            medium: { min: 10, max: 99 },
            hard: { min: 100, max: 999 }
        };

        const range = ranges[selectedDifficulty];
        const tasks = [];
        const usedNumbers = new Set();

        // Generiraj 10 jedinstvenih zadataka
        while (tasks.length < 10) {
            const number = getRandomNumber(range.min, range.max);
            if (!usedNumbers.has(number)) {
                usedNumbers.add(number);
                tasks.push({
                    number: number,
                    answer: numberToWords(number)
                });
            }
        }

        // Kreiraj HTML za printanje
        const worksheetHtml = `
            <div class="worksheet-print">
                <h1>Radni list - Pisanje brojeva riječima</h1>
                <ul class="task-list">
                    ${tasks.map((task, index) => `
                        <li class="task-item">
                            <span class="task-number">${index + 1}.</span>
                            <div class="task-content">
                                <div>Napiši broj ${task.number} riječima:</div>
                                <div class="answer-line"></div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        // Dodaj worksheet u DOM
        const worksheetContainer = document.createElement('div');
        worksheetContainer.innerHTML = worksheetHtml;
        document.body.appendChild(worksheetContainer);

        // Printaj i nakon toga ukloni worksheet
        setTimeout(() => {
            window.print();
            document.body.removeChild(worksheetContainer);
        }, 100);
    }

    // Funkcija za provjeru odgovora
    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const isCorrect = userAnswer === currentTask.answer;

        if (isCorrect) {
            feedbackElement.className = 'feedback success';
            feedbackElement.textContent = 'Točno!';
            score += 10;
            streak++;
        } else {
            feedbackElement.className = 'feedback error';
            feedbackElement.textContent = `Netočno. Točan odgovor je: ${currentTask.answer}`;
            streak = 0;
        }

        updateUI();
    }

    // Funkcija za ažuriranje UI-a
    function updateUI() {
        scoreElement.textContent = score;
        
        // Ažuriranje zvjezdica za streak
        streakStarsElement.innerHTML = '';
        const maxStars = 5;
        for (let i = 0; i < Math.min(streak, maxStars); i++) {
            streakStarsElement.innerHTML += '<i class="fas fa-star star"></i>';
        }

        // Ažuriranje progress bara
        streakProgressElement.style.width = `${Math.min(streak * 20, 100)}%`;

        // Ažuriranje teksta težine
        const difficultyText = {
            easy: 'lagano',
            medium: 'srednje',
            hard: 'teško'
        };
        currentLevelElement.textContent = difficultyText[difficulty];

        // Omogući/onemogući gumb za provjeru
        checkButton.disabled = !answerInput.value.trim();
    }

    // Event listeners
    checkButton.addEventListener('click', checkAnswer);
    nextButton.addEventListener('click', generateTask);
    
    answerInput.addEventListener('input', () => {
        checkButton.disabled = !answerInput.value.trim();
    });

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && answerInput.value.trim()) {
            checkAnswer();
        }
    });

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficulty = button.dataset.level;
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            generateTask();
        });
    });

    // Event listener za print button
    printButton.addEventListener('click', () => {
        const selectedDifficulty = printDifficultySelect.value;
        generateWorksheet(selectedDifficulty);
    });

    // Text-to-speech funkcionalnost
    soundButton.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentTask.number.toString());
            utterance.lang = 'hr-HR';
            speechSynthesis.speak(utterance);
        }
    });

    // Inicijalno generiranje zadatka
    generateTask();
});
