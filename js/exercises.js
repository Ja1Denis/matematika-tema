// exercises.js

class ExerciseSystem {
    constructor() {
        this.grades = {
            'pre-k': {
                name: 'Pre-K',
                subjects: {
                    'math': { name: 'Math', progress: 0 },
                    'language-arts': { name: 'Language Arts', progress: 0 },
                    'social-studies': { name: 'Social Studies', progress: 0 }
                }
            },
            'kindergarten': {
                name: 'Kindergarten',
                subjects: {
                    'math': { name: 'Math', progress: 0 },
                    'language-arts': { name: 'Language Arts', progress: 0 },
                    'social-studies': { name: 'Social Studies', progress: 0 }
                }
            },
            'first-grade': {
                name: 'First Grade',
                subjects: {
                    'math': { name: 'Math', progress: 0 },
                    'language-arts': { name: 'Language Arts', progress: 0 },
                    'social-studies': { name: 'Social Studies', progress: 0 }
                }
            }
            // Dodati ostale razrede prema slici...
        };

        this.currentGrade = null;
        this.currentSubject = null;
        this.currentExercise = null;
        this.userProgress = {};

        this.init();
    }

    init() {
        this.loadUserProgress();
        this.setupEventListeners();
        this.renderGradeSelection();
    }

    loadUserProgress() {
        const savedProgress = localStorage.getItem('userProgress');
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
        }
    }

    saveUserProgress() {
        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.grade-card')) {
                const grade = e.target.dataset.grade;
                this.selectGrade(grade);
            }
            if (e.target.matches('.subject-card')) {
                const subject = e.target.dataset.subject;
                this.selectSubject(subject);
            }
            if (e.target.matches('.exercise-start-btn')) {
                this.startExercise();
            }
            if (e.target.matches('.check-answer-btn')) {
                this.checkAnswer();
            }
            if (e.target.matches('.next-exercise-btn')) {
                this.loadNextExercise();
            }
        });
    }

    renderGradeSelection() {
        const container = document.querySelector('.grades-container');
        if (!container) return;

        let html = '';
        for (const [gradeKey, grade] of Object.entries(this.grades)) {
            html += `
                <div class="grade-card" data-grade="${gradeKey}">
                    <h3>${grade.name}</h3>
                    <div class="subjects-list">
                        ${Object.entries(grade.subjects).map(([subjectKey, subject]) => `
                            <div class="subject-item">
                                <span>${subject.name}</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${subject.progress}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    }

    selectGrade(gradeKey) {
        this.currentGrade = gradeKey;
        this.renderSubjects(gradeKey);
    }

    renderSubjects(gradeKey) {
        const grade = this.grades[gradeKey];
        const container = document.querySelector('.content-area');
        if (!grade || !container) return;

        let html = `
            <h2>${grade.name} - Predmeti</h2>
            <div class="subjects-grid">
                ${Object.entries(grade.subjects).map(([subjectKey, subject]) => `
                    <div class="subject-card" data-subject="${subjectKey}">
                        <h3>${subject.name}</h3>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${subject.progress}%"></div>
                        </div>
                        <button class="start-subject-btn">Započni učenje</button>
                    </div>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    }

    generateExercise(grade, subject) {
        // Implementacija generiranja zadataka prema razredu i predmetu
        const exercises = {
            'math': {
                'pre-k': () => this.generatePreKMathExercise(),
                'kindergarten': () => this.generateKindergartenMathExercise(),
                'first-grade': () => this.generateFirstGradeMathExercise()
            },
            'language-arts': {
                'pre-k': () => this.generatePreKLanguageExercise(),
                'kindergarten': () => this.generateKindergartenLanguageExercise(),
                'first-grade': () => this.generateFirstGradeLanguageExercise()
            }
        };

        return exercises[subject]?.[grade]?.() || null;
    }

    generatePreKMathExercise() {
        // Primjer generiranja zadatka za predškolsku matematiku
        const numbers = [1, 2, 3, 4, 5];
        const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
        
        return {
            type: 'counting',
            question: `Koliko predmeta vidiš na slici?`,
            correctAnswer: randomNum,
            options: this.shuffleArray([...numbers])
        };
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startExercise() {
        if (!this.currentGrade || !this.currentSubject) return;

        const exercise = this.generateExercise(this.currentGrade, this.currentSubject);
        if (!exercise) return;

        this.currentExercise = exercise;
        this.renderExercise(exercise);
    }

    renderExercise(exercise) {
        const container = document.querySelector('.exercise-container');
        if (!container) return;

        container.innerHTML = `
            <div class="exercise-wrapper">
                <h3>${exercise.question}</h3>
                <div class="options-container">
                    ${exercise.options.map(option => `
                        <button class="option-btn" data-value="${option}">${option}</button>
                    `).join('')}
                </div>
                <button class="check-answer-btn">Provjeri odgovor</button>
            </div>
        `;
    }

    checkAnswer() {
        if (!this.currentExercise) return;

        const selectedOption = document.querySelector('.option-btn.selected');
        if (!selectedOption) return;

        const userAnswer = parseInt(selectedOption.dataset.value);
        const isCorrect = userAnswer === this.currentExercise.correctAnswer;

        this.updateProgress(isCorrect);
        this.showResult(isCorrect);
    }

    updateProgress(isCorrect) {
        if (!this.currentGrade || !this.currentSubject) return;

        const progressKey = `${this.currentGrade}-${this.currentSubject}`;
        if (!this.userProgress[progressKey]) {
            this.userProgress[progressKey] = {
                completed: 0,
                correct: 0,
                total: 0
            };
        }

        this.userProgress[progressKey].total++;
        if (isCorrect) {
            this.userProgress[progressKey].correct++;
        }
        this.userProgress[progressKey].completed++;

        this.saveUserProgress();
        this.updateProgressDisplay();
    }

    showResult(isCorrect) {
        const resultDiv = document.createElement('div');
        resultDiv.className = `result ${isCorrect ? 'correct' : 'incorrect'}`;
        resultDiv.textContent = isCorrect ? 'Točno!' : 'Netočno. Pokušaj ponovno!';
        
        document.querySelector('.exercise-wrapper').appendChild(resultDiv);
        
        if (isCorrect) {
            setTimeout(() => {
                this.loadNextExercise();
            }, 1500);
        }
    }

    loadNextExercise() {
        this.startExercise();
    }
}

// Inicijalizacija sustava vježbi
document.addEventListener('DOMContentLoaded', () => {
    const exerciseSystem = new ExerciseSystem();
});