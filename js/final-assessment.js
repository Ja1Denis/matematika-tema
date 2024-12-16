jQuery(document).ready(function($) {
    // Globalne varijable
    let currentGrade = null;
    let currentQuestion = 1;
    let totalQuestions = 0;
    let timeLimit = 0;
    let timer = null;
    let answers = [];
    let startTime = null;

    // Konstante za vremenska ograničenja po razredima
    const TIME_LIMITS = {
        1: 45 * 60, // 45 minuta za 1. razred
        2: 45 * 60,
        3: 60 * 60, // 60 minuta za 3. razred
        4: 60 * 60,
        5: 90 * 60, // 90 minuta za 5. razred
        6: 90 * 60,
        7: 90 * 60,
        8: 90 * 60
    };

    // Inicijalizacija
    function init() {
        bindEvents();
        setupGradeSelection();
    }

    // Postavljanje događaja
    function bindEvents() {
        $('.grade-option').on('click', handleGradeSelection);
        $('#back-to-intro').on('click', showIntro);
        $('#start-assessment').on('click', startAssessment);
        $('#next-btn').on('click', handleNextQuestion);
        $('#finish-btn').on('click', finishAssessment);
        $('#view-solutions').on('click', showSolutions);
        $('#back-to-results').on('click', showResults);
        $('#new-assessment').on('click', resetAssessment);
        $('#prev-solution').on('click', showPreviousSolution);
        $('#next-solution').on('click', showNextSolution);
    }

    // Postavljanje odabira razreda
    function setupGradeSelection() {
        $('.grade-option').each(function() {
            const grade = $(this).data('grade');
            const timeLimit = TIME_LIMITS[grade];
            const minutes = timeLimit / 60;
            
            // Ažuriranje prikaza vremena
            $(this).find('.time-limit').text(`${minutes} minuta`);
        });
    }

    // Rukovanje odabirom razreda
    function handleGradeSelection() {
        currentGrade = $(this).data('grade');
        showOverview();
    }

    // Prikaz pregleda provjere
    function showOverview() {
        $('.assessment-intro').hide();
        const overview = $('.assessment-overview');
        overview.show();

        // Postavljanje podataka o provjeri
        $('.current-grade').text(`${currentGrade}. razred`);
        $('.time-limit').text(`${TIME_LIMITS[currentGrade] / 60} minuta`);
        
        // Dohvaćanje tema za odabrani razred
        loadTopics(currentGrade);
    }

    // Učitavanje tema za razred
    function loadTopics(grade) {
        // Simulirani podaci - zamijeniti s pravim API pozivom
        const topics = getTopicsForGrade(grade);
        const topicsList = $('.topics-list');
        topicsList.empty();

        topics.forEach(topic => {
            topicsList.append(`
                <div class="topic-item">
                    <h4>${topic.name}</h4>
                    <p>${topic.description}</p>
                </div>
            `);
        });
    }

    // Pokretanje provjere
    function startAssessment() {
        $('.assessment-overview').hide();
        $('.assessment-content').show();
        
        // Postavljanje vremena
        timeLimit = TIME_LIMITS[currentGrade];
        startTimer();
        
        // Učitavanje prvog pitanja
        loadQuestion(1);
        
        // Bilježenje vremena početka
        startTime = new Date();
    }

    // Pokretanje brojača vremena
    function startTimer() {
        let remainingTime = timeLimit;
        updateTimerDisplay(remainingTime);

        timer = setInterval(() => {
            remainingTime--;
            updateTimerDisplay(remainingTime);

            if (remainingTime <= 300) { // 5 minuta preostalo
                $('#timer').addClass('timer-warning');
            }

            if (remainingTime <= 0) {
                clearInterval(timer);
                finishAssessment();
            }
        }, 1000);
    }

    // Ažuriranje prikaza vremena
    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        $('#timer').text(
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        );
    }

    // Učitavanje pitanja
    function loadQuestion(questionNumber) {
        // Simulirani podaci - zamijeniti s pravim API pozivom
        const question = getQuestion(questionNumber, currentGrade);
        
        if (!question) {
            finishAssessment();
            return;
        }

        currentQuestion = questionNumber;
        updateQuestionDisplay(question);
    }

    // Ažuriranje prikaza pitanja
    function updateQuestionDisplay(question) {
        $('.topic-indicator').text(question.topic);
        $('#question-text').html(question.text);
        
        // Postavljanje slike ako postoji
        if (question.image) {
            $('#question-image').html(`<img src="${question.image}" alt="Question image">`).show();
        } else {
            $('#question-image').hide();
        }

        // Postavljanje interaktivnog područja ovisno o tipu pitanja
        setupInteractiveArea(question);

        // Ažuriranje navigacije
        updateNavigation();
    }

    // Postavljanje interaktivnog područja
    function setupInteractiveArea(question) {
        const interactiveArea = $('#interactive-area');
        const drawingCanvas = $('#drawing-canvas');
        const answersGrid = $('#answers');

        // Resetiranje područja
        interactiveArea.empty();
        drawingCanvas.hide();
        answersGrid.empty();

        switch (question.type) {
            case 'multiple-choice':
                setupMultipleChoice(question, answersGrid);
                break;
            case 'drawing':
                setupDrawingArea(drawingCanvas);
                break;
            case 'drag-drop':
                setupDragDrop(question, interactiveArea);
                break;
            case 'math-input':
                setupMathInput(interactiveArea);
                break;
        }
    }

    // Postavljanje višestrukog izbora
    function setupMultipleChoice(question, container) {
        question.options.forEach((option, index) => {
            container.append(`
                <div class="answer-option" data-index="${index}">
                    <input type="radio" name="answer" id="option${index}" value="${index}">
                    <label for="option${index}">${option}</label>
                </div>
            `);
        });
    }

    // Postavljanje područja za crtanje
    function setupDrawingArea(canvas) {
        canvas.show();
        // Implementacija crtanja
    }

    // Postavljanje drag-drop područja
    function setupDragDrop(question, container) {
        // Implementacija drag-drop funkcionalnosti
    }

    // Postavljanje unosa matematičkih izraza
    function setupMathInput(container) {
        container.append(`
            <div class="math-input-container">
                <input type="text" class="math-input" placeholder="Unesite matematički izraz">
                <div class="math-preview"></div>
            </div>
        `);
        // Implementacija MathJax pregleda
    }

    // Ažuriranje navigacije
    function updateNavigation() {
        $('#current-question').text(currentQuestion);
        $('#total-questions').text(totalQuestions);
        
        const progressPercentage = (currentQuestion / totalQuestions) * 100;
        $('.progress-fill').css('width', `${progressPercentage}%`);

        // Prikaz/skrivanje gumba za završetak
        if (currentQuestion === totalQuestions) {
            $('#next-btn').hide();
            $('#finish-btn').show();
        } else {
            $('#next-btn').show();
            $('#finish-btn').hide();
        }
    }

    // Rukovanje sljedećim pitanjem
    function handleNextQuestion() {
        saveAnswer();
        loadQuestion(currentQuestion + 1);
    }

    // Spremanje odgovora
    function saveAnswer() {
        // Implementacija spremanja odgovora ovisno o tipu pitanja
    }

    // Završetak provjere
    function finishAssessment() {
        clearInterval(timer);
        saveAnswer();
        calculateResults();
        showResults();
    }

    // Izračun rezultata
    function calculateResults() {
        // Implementacija izračuna rezultata
    }

    // Prikaz rezultata
    function showResults() {
        $('.assessment-content').hide();
        $('.solutions-container').hide();
        $('.results-container').show();

        // Izračun vremena
        const endTime = new Date();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;

        // Prikaz rezultata
        $('.final-score').text('85%'); // Primjer rezultata
        $('.time-taken').text(`Vrijeme rješavanja: ${minutes}m ${seconds}s`);

        // Prikaz rezultata po temama
        displayTopicResults();
        displaySkillAnalysis();
        generateRecommendations();
    }

    // Prikaz rezultata po temama
    function displayTopicResults() {
        // Implementacija prikaza rezultata po temama
    }

    // Prikaz analize vještina
    function displaySkillAnalysis() {
        // Implementacija prikaza analize vještina
    }

    // Generiranje preporuka
    function generateRecommendations() {
        // Implementacija generiranja preporuka
    }

    // Prikaz rješenja
    function showSolutions() {
        $('.results-container').hide();
        $('.solutions-container').show();
        displaySolution(1);
    }

    // Prikaz rješenja za određeno pitanje
    function displaySolution(questionNumber) {
        // Implementacija prikaza rješenja
    }

    // Prikaz prethodnog rješenja
    function showPreviousSolution() {
        // Implementacija navigacije kroz rješenja
    }

    // Prikaz sljedećeg rješenja
    function showNextSolution() {
        // Implementacija navigacije kroz rješenja
    }

    // Prikaz početnog ekrana
    function showIntro() {
        $('.assessment-overview').hide();
        $('.assessment-content').hide();
        $('.results-container').hide();
        $('.solutions-container').hide();
        $('.assessment-intro').show();
    }

    // Resetiranje provjere
    function resetAssessment() {
        currentGrade = null;
        currentQuestion = 1;
        totalQuestions = 0;
        answers = [];
        startTime = null;
        
        if (timer) {
            clearInterval(timer);
        }

        $('.results-container').hide();
        $('.solutions-container').hide();
        $('.assessment-content').hide();
        $('.assessment-overview').hide();
        $('.assessment-intro').show();
    }

    // Pomoćne funkcije za simulaciju podataka
    function getTopicsForGrade(grade) {
        // Simulirani podaci - zamijeniti s pravim API pozivom
        return [
            {
                name: 'Brojevi i operacije',
                description: 'Osnovne matematičke operacije i rad s brojevima'
            },
            {
                name: 'Geometrija',
                description: 'Oblici, mjerenja i prostorni odnosi'
            },
            {
                name: 'Algebra',
                description: 'Izrazi, jednadžbe i funkcije'
            }
        ];
    }

    function getQuestion(number, grade) {
        // Simulirani podaci - zamijeniti s pravim API pozivom
        return {
            id: number,
            type: 'multiple-choice',
            topic: 'Brojevi i operacije',
            text: 'Koliko je 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: 1
        };
    }

    // Pokretanje inicijalizacije
    init();
});
