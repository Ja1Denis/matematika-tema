document.addEventListener('DOMContentLoaded', function() {
    // DOM elementi
    const currentNumber = document.getElementById('currentNumber');
    const textAnswer = document.getElementById('textAnswer');
    const checkAnswer = document.getElementById('checkAnswer');
    const newNumber = document.getElementById('newNumber');
    const speakButton = document.getElementById('speakButton');
    const difficultySelect = document.getElementById('difficultySelect');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const feedback = document.getElementById('feedback');
    const stars = document.getElementById('stars');
    const printExercises = document.getElementById('printExercises');
    const gameView = document.getElementById('gameView');
    const printView = document.getElementById('printView');
    const exercisesList = document.getElementById('exercisesList');

    // Konfiguracija težine
    const difficultyConfig = {
        easy: { min: 1, max: 30, points: 1 },
        medium: { min: 1, max: 60, points: 2 },
        hard: { min: 1, max: 100, points: 3 }
    };

    // Stanje igre
    let score = 0;
    let currentStars = 0;
    const maxStars = 5;
    const pointsPerStar = 5;

    // Funkcija za generiranje novog broja
    function generateNumber() {
        const difficulty = difficultySelect.value;
        const { min, max } = difficultyConfig[difficulty];
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        currentNumber.textContent = num;
        textAnswer.value = '';
        feedback.innerHTML = '';
        return num;
    }

    // Funkcija za pretvaranje broja u riječi
    function numberToWords(num) {
        const jedinice = ['', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet'];
        const teens = ['deset', 'jedanaest', 'dvanaest', 'trinaest', 'četrnaest', 'petnaest', 'šesnaest', 'sedamnaest', 'osamnaest', 'devetnaest'];
        const desetice = ['', 'deset', 'dvadeset', 'trideset', 'četrdeset', 'pedeset', 'šezdeset', 'sedamdeset', 'osamdeset', 'devedeset'];
        const stotice = ['', 'sto', 'dvjesto', 'tristo', 'četiristo', 'petsto', 'šesto', 'sedamsto', 'osamsto', 'devetsto'];

        if (num === 0) return 'nula';
        
        let words = '';
        
        // Stotice
        if (num >= 100) {
            words += stotice[Math.floor(num / 100)] + ' ';
            num %= 100;
        }
        
        // Desetice i jedinice
        if (num >= 10 && num < 20) {
            words += teens[num - 10];
        } else {
            if (num >= 20) {
                words += desetice[Math.floor(num / 10)] + ' ';
                num %= 10;
            }
            if (num > 0) {
                words += jedinice[num];
            }
        }
        
        return words.trim();
    }

    // Funkcija za provjeru odgovora
    function checkUserAnswer() {
        const num = parseInt(currentNumber.textContent);
        const correctAnswer = numberToWords(num);
        const userAnswer = textAnswer.value.trim().toLowerCase();
        const checkmarkElement = document.getElementById('checkmark');
        const feedbackElement = document.getElementById('feedback');

        if (userAnswer === correctAnswer) {
            const difficulty = difficultySelect.value;
            const points = difficultyConfig[difficulty].points;
            score += points;
            scoreDisplay.textContent = score;
            updateStars();
            
            // Sakrij feedback i prikaži kvačicu
            feedbackElement.innerHTML = '';
            checkmarkElement.style.display = 'block';
            
            // Nakon animacije, sakrij kvačicu i generiraj novi broj
            setTimeout(() => {
                checkmarkElement.style.display = 'none';
                generateNumber();
                textAnswer.value = ''; // Očisti input polje
            }, 2000);
        } else {
            feedbackElement.innerHTML = '<div class="alert alert-danger">Netočno. Pokušaj ponovno!</div>';
            checkmarkElement.style.display = 'none';
        }
    }

    // Funkcija za ažuriranje zvjezdica
    function updateStars() {
        const earnedStars = Math.min(Math.floor(score / pointsPerStar), maxStars);
        if (earnedStars !== currentStars) {
            currentStars = earnedStars;
            const starsHTML = Array(maxStars).fill('☆').map((star, index) => 
                index < earnedStars ? '⭐' : '☆'
            ).join('');
            stars.innerHTML = starsHTML;
        }
    }

    // Funkcija za izgovor broja
    function speakNumber() {
        if ('speechSynthesis' in window) {
            const num = currentNumber.textContent;
            const utterance = new SpeechSynthesisUtterance(num);
            utterance.lang = 'hr-HR';
            speechSynthesis.speak(utterance);
        }
    }

    // Funkcija za generiranje liste zadataka za print
    function generatePrintExercises() {
        const difficulty = difficultySelect.value;
        
        // Sakrij game view i prikaži print view
        gameView.style.display = 'none';
        printView.style.display = 'block';
        exercisesList.innerHTML = '';

        // Generiraj 10 zadataka
        for (let i = 1; i <= 10; i++) {
            const num = Math.floor(Math.random() * (difficultyConfig[difficulty].max - difficultyConfig[difficulty].min + 1)) + difficultyConfig[difficulty].min;
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-item';
            exerciseDiv.innerHTML = `
                <div class="exercise-number">${i}.</div>
                <div class="exercise-content">
                    <span class="number-to-convert">${num}</span>
                    <div class="answer-line"></div>
                </div>
            `;
            exercisesList.appendChild(exerciseDiv);
        }

        // Otvori print dijalog
        window.print();

        // Nakon printanja, vrati na game view
        setTimeout(() => {
            printView.style.display = 'none';
            gameView.style.display = 'block';
        }, 1000);
    }

    // Event listeners
    difficultySelect.addEventListener('change', generateNumber);
    checkAnswer.addEventListener('click', checkUserAnswer);
    newNumber.addEventListener('click', generateNumber);
    speakButton.addEventListener('click', speakNumber);
    printExercises.addEventListener('click', generatePrintExercises);
    textAnswer.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkUserAnswer();
        }
    });

    // Inicijalno generiranje broja
    generateNumber();
});
