jQuery(document).ready(function($) {
    // Konstante
    const GRADES = {
        1: { name: '1. razred', questions: 10 },
        2: { name: '2. razred', questions: 10 },
        3: { name: '3. razred', questions: 10 },
        4: { name: '4. razred', questions: 10 },
        5: { name: '5. razred', questions: 10 },
        6: { name: '6. razred', questions: 10 },
        7: { name: '7. razred', questions: 10 },
        8: { name: '8. razred', questions: 10 },
        'all': { name: 'Opća procjena', questions: 16 }
    };

    // Stanje aplikacije
    let state = {
        currentGrade: null,
        currentQuestion: 0,
        questions: [],
        answers: [],
        score: 0
    };

    // Event Listeners
    $('.grade-option').on('click', function() {
        const grade = $(this).data('grade');
        if (grade === 1) {
            showFirstGradeConcepts();
        } else {
            startAssessment(grade);
        }
    });

    $('#next-btn').on('click', nextQuestion);
    $('#prev-btn').on('click', prevQuestion);
    $('#finish-btn').on('click', finishAssessment);
    $('#restart-btn').on('click', restartAssessment);

    // Pokazivanje koncepata za prvi razred
    function showFirstGradeConcepts() {
        $('#grade-selection').hide();
        $('#first-grade-concepts').show();
    }

    // Povratak na odabir razreda
    $('.back-to-grades').on('click', function() {
        $('#first-grade-concepts').hide();
        $('#grade-selection').show();
    });

    // Rukovanje klikovima na koncepte
    $('.concept-card').on('click', function(e) {
        e.preventDefault();
        const concept = $(this).data('concept');
        redirectToApplication(concept);
    });

    // Preusmjeravanje na odgovarajuću aplikaciju
    function redirectToApplication(concept) {
        let url = '';
        switch(concept) {
            case 'brojevi-do-20':
                url = '/interaktivno/brojevi-do-20';
                break;
            // Dodajte više slučajeva prema potrebi
        }
        if (url) {
            window.location.href = url;
        }
    }

    // Funkcije
    function startAssessment(grade) {
        state.currentGrade = grade;
        state.currentQuestion = 0;
        state.questions = [];
        state.answers = [];
        state.score = 0;

        // Dohvati pitanja za odabrani razred
        loadQuestions(grade).then(() => {
            $('#grade-selection').hide();
            $('#assessment-content').show();
            updateQuestionDisplay();
            updateProgressBar();
        });
    }

    function loadQuestions(grade) {
        return new Promise((resolve) => {
            // Ovdje ćemo kasnije implementirati AJAX poziv za dohvaćanje pitanja
            // Za sada koristimo mock podatke
            state.questions = generateMockQuestions(grade);
            resolve();
        });
    }

    function generateMockQuestions(grade) {
        const questions = [];
        const numQuestions = GRADES[grade].questions;
        const topics = getTopicsForGrade(grade);

        for (let i = 0; i < numQuestions; i++) {
            questions.push({
                id: i + 1,
                text: `Pitanje ${i + 1} za ${GRADES[grade].name} - ${topics[i % topics.length]}`,
                answers: [
                    { text: 'Odgovor A', correct: i % 4 === 0 },
                    { text: 'Odgovor B', correct: i % 4 === 1 },
                    { text: 'Odgovor C', correct: i % 4 === 2 },
                    { text: 'Odgovor D', correct: i % 4 === 3 }
                ],
                topic: topics[i % topics.length]
            });
        }
        return questions;
    }

    function getTopicsForGrade(grade) {
        const commonTopics = ['Brojevi', 'Algebra', 'Geometrija', 'Mjerenje'];
        const gradeSpecificTopics = {
            1: ['Zbrajanje', 'Oduzimanje', 'Oblici', 'Vrijeme'],
            2: ['Množenje', 'Dijeljenje', 'Razlomci', 'Novac'],
            3: ['Decimalni brojevi', 'Površina', 'Opseg', 'Statistika'],
            4: ['Kutovi', 'Koordinate', 'Simetrija', 'Vjerojatnost'],
            5: ['Razlomci', 'Decimalni brojevi', 'Postoci', 'Površina i opseg'],
            6: ['Cijeli brojevi', 'Linearne jednadžbe', 'Trokuti', 'Četverokuti'],
            7: ['Proporcionalnost', 'Algebarski izrazi', 'Kružnica', 'Statistika'],
            8: ['Kvadriranje', 'Pitagorin poučak', 'Vektori', 'Vjerojatnost'],
            'all': [...commonTopics]
        };

        return grade === 'all' ? commonTopics : gradeSpecificTopics[grade];
    }

    function updateQuestionDisplay() {
        const question = state.questions[state.currentQuestion];
        $('#question-text').text(question.text);
        
        const answersHtml = question.answers.map((answer, index) => {
            return `
                <div class="answer-option ${state.answers[state.currentQuestion] === index ? 'selected' : ''}" 
                     data-index="${index}">
                    ${answer.text}
                </div>
            `;
        }).join('');
        
        $('#answers').html(answersHtml);
        
        // Dodaj event listener za odgovore
        $('.answer-option').on('click', function() {
            const index = $(this).data('index');
            selectAnswer(index);
        });

        // Ažuriraj navigacijske gumbe
        updateNavigationButtons();
    }

    function selectAnswer(index) {
        state.answers[state.currentQuestion] = index;
        $('.answer-option').removeClass('selected');
        $(`.answer-option[data-index="${index}"]`).addClass('selected');
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const isFirstQuestion = state.currentQuestion === 0;
        const isLastQuestion = state.currentQuestion === state.questions.length - 1;
        const hasCurrentAnswer = state.answers[state.currentQuestion] !== undefined;

        $('#prev-btn').toggle(!isFirstQuestion);
        $('#next-btn').toggle(!isLastQuestion);
        $('#finish-btn').toggle(isLastQuestion && hasCurrentAnswer);
    }

    function updateProgressBar() {
        const progress = ((state.currentQuestion + 1) / state.questions.length) * 100;
        $('.progress-fill').css('width', `${progress}%`);
        $('#current-question').text(state.currentQuestion + 1);
        $('#total-questions').text(state.questions.length);
    }

    function nextQuestion() {
        if (state.currentQuestion < state.questions.length - 1) {
            state.currentQuestion++;
            updateQuestionDisplay();
            updateProgressBar();
        }
    }

    function prevQuestion() {
        if (state.currentQuestion > 0) {
            state.currentQuestion--;
            updateQuestionDisplay();
            updateProgressBar();
        }
    }

    function finishAssessment() {
        calculateScore();
        displayResults();
    }

    function calculateScore() {
        state.score = state.answers.reduce((score, answerIndex, questionIndex) => {
            const question = state.questions[questionIndex];
            return score + (question.answers[answerIndex].correct ? 1 : 0);
        }, 0);
    }

    function displayResults() {
        $('#assessment-content').hide();
        $('#results').show();

        const percentage = (state.score / state.questions.length) * 100;
        const recommendations = generateRecommendations(percentage);

        $('.score-summary').html(`
            <h3>Rezultat: ${state.score} od ${state.questions.length} (${percentage.toFixed(1)}%)</h3>
            <div class="score-chart">
                <div class="score-fill" style="width: ${percentage}%"></div>
            </div>
        `);

        $('.recommendations').html(`
            <h3>Preporuke za daljnje učenje:</h3>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `);
    }

    function generateRecommendations(percentage) {
        const recommendations = [];
        const topics = getTopicsForGrade(state.currentGrade);

        if (percentage < 50) {
            recommendations.push('Preporučujemo da ponovite osnovne koncepte iz sljedećih područja:');
            recommendations.push(...topics.map(topic => `- ${topic}: Osnovni koncepti i zadaci`));
        } else if (percentage < 75) {
            recommendations.push('Dobro vam ide! Za dodatno poboljšanje, fokusirajte se na:');
            recommendations.push(...topics.slice(0, 2).map(topic => `- ${topic}: Srednje teški zadaci`));
        } else {
            recommendations.push('Odlično! Za dodatni izazov, pokušajte:');
            recommendations.push(...topics.slice(0, 2).map(topic => `- ${topic}: Napredni zadaci i problemi`));
        }

        return recommendations;
    }

    function restartAssessment() {
        $('#results').hide();
        $('#grade-selection').show();
        state = {
            currentGrade: null,
            currentQuestion: 0,
            questions: [],
            answers: [],
            score: 0
        };
    }
});
