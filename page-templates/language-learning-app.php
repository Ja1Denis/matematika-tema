<?php
/**
 * Template Name: Učenje Riječi
 * Description: Predložak za modernu aplikaciju učenja riječi
 */

get_header();
require_once get_template_directory() . '/includes/language-learning-db-setup.php';

$initial_words = json_encode(get_random_words(10));
?>

<main id="primary" class="site-main">
    <div class="page-header">
        <div class="container">
            <a href="<?php echo esc_url(home_url('/igre')); ?>" class="back-link">
                <i class="fas fa-arrow-left"></i>
                Natrag na igre
            </a>
            <h1 class="page-title"><?php the_title(); ?></h1>
        </div>
    </div>

    <div class="container">
        <div class="language-learning-app">
            <!-- Glavni kontejner za aplikaciju -->
            <div class="app-container">
                <!-- Navigacija za odabir vrste zadatka -->
                <div class="task-type-nav">
                    <button class="task-type-btn active" data-type="translation">Prevođenje</button>
                    <button class="task-type-btn" data-type="fill-in">Dopunjavanje</button>
                    <button class="task-type-btn" data-type="matching">Povezivanje</button>
                </div>

                <!-- Statistika i napredak -->
                <div class="progress-section">
                    <div class="score-container">
                        <div class="score">
                            <i class="fas fa-star"></i>
                            <span id="score">0</span>
                        </div>
                        <div class="streak">
                            <i class="fas fa-fire"></i>
                            <span id="streak">0</span>
                        </div>
                    </div>
                    <div class="level-progress">
                        <span>Razina: <span id="current-level">Početnik</span></span>
                        <div class="progress-bar">
                            <div class="progress" id="level-progress"></div>
                        </div>
                    </div>
                </div>

                <!-- Glavni prostor za zadatke -->
                <div class="task-container">
                    <div class="task-content">
                        <div id="question-container"></div>
                        <div id="answer-container"></div>
                    </div>
                    <div class="feedback-container" id="feedback"></div>
                </div>

                <!-- Kontrole -->
                <div class="controls">
                    <button id="check-answer" class="primary-btn">Provjeri</button>
                    <button id="next-task" class="secondary-btn" disabled>Sljedeći zadatak</button>
                </div>
            </div>

            <!-- Bočna statistika -->
            <div class="stats-sidebar">
                <h3>Statistika</h3>
                <div class="stats-content">
                    <div class="stat-item">
                        <span class="stat-label">Točni odgovori:</span>
                        <span id="correct-answers">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Netočni odgovori:</span>
                        <span id="wrong-answers">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Najbolji niz:</span>
                        <span id="best-streak">0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
.language-learning-app {
    display: grid;
    grid-template-columns: 1fr 250px;
    gap: 2rem;
    padding: 2rem 0;
}

.app-container {
    background: #fff;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.task-type-nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.task-type-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    background: #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.task-type-btn.active {
    background: #007bff;
    color: white;
}

.progress-section {
    margin-bottom: 2rem;
}

.score-container {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
}

.score, .streak {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
}

.level-progress {
    background: #f0f0f0;
    border-radius: 0.5rem;
    padding: 1rem;
}

.progress-bar {
    height: 0.5rem;
    background: #ddd;
    border-radius: 0.25rem;
    margin-top: 0.5rem;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: #28a745;
    width: 0%;
    transition: width 0.3s ease;
}

.task-container {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 2rem;
    min-height: 300px;
    margin-bottom: 2rem;
}

.controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.primary-btn, .secondary-btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.primary-btn {
    background: #007bff;
    color: white;
}

.secondary-btn {
    background: #6c757d;
    color: white;
}

.primary-btn:disabled, .secondary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.stats-sidebar {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;
}

.feedback-container {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
}

@media (max-width: 768px) {
    .language-learning-app {
        grid-template-columns: 1fr;
    }
    
    .task-type-nav {
        flex-direction: column;
    }
    
    .controls {
        flex-direction: column;
    }
    
    .primary-btn, .secondary-btn {
        width: 100%;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija aplikacije
    const app = {
        score: 0,
        streak: 0,
        bestStreak: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentTask: null,
        words: <?php echo $initial_words; ?>, // Load words from PHP
        
        // Inicijalizacija aplikacije
        init: function() {
            this.setupEventListeners();
            this.generateNewTask();
        },
        
        // Učitavanje novih riječi iz baze podataka
        loadNewWords: async function() {
            try {
                const response = await fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'action=get_new_words'
                });
                const data = await response.json();
                if (data.success) {
                    this.words = data.words;
                }
            } catch (error) {
                console.error('Error loading new words:', error);
            }
        },
        
        // Postavljanje event listenera
        setupEventListeners: function() {
            document.getElementById('check-answer').addEventListener('click', () => this.checkAnswer());
            document.getElementById('next-task').addEventListener('click', () => this.generateNewTask());
            
            // Event listeneri za tipove zadataka
            document.querySelectorAll('.task-type-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.task-type-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.generateNewTask();
                });
            });
        },
        
        // Generiranje novog zadatka
        generateNewTask: function() {
            const taskType = document.querySelector('.task-type-btn.active').dataset.type;
            const word = this.words[Math.floor(Math.random() * this.words.length)];
            
            const questionContainer = document.getElementById('question-container');
            const answerContainer = document.getElementById('answer-container');
            
            switch(taskType) {
                case 'translation':
                    this.generateTranslationTask(word, questionContainer, answerContainer);
                    break;
                case 'fill-in':
                    this.generateFillInTask(word, questionContainer, answerContainer);
                    break;
                case 'matching':
                    this.generateMatchingTask(questionContainer, answerContainer);
                    break;
            }
            
            document.getElementById('check-answer').disabled = false;
            document.getElementById('next-task').disabled = true;
            document.getElementById('feedback').innerHTML = '';
        },
        
        // Generiranje zadatka za prevođenje
        generateTranslationTask: function(word, questionContainer, answerContainer) {
            this.currentTask = {
                type: 'translation',
                word: word,
                correctAnswer: word.english_word
            };
            
            questionContainer.innerHTML = `
                <h3>Prevedi riječ:</h3>
                <p class="word">${word.croatian_word}</p>
                <p class="example">${word.example_sentence}</p>
            `;
            answerContainer.innerHTML = `<input type="text" id="answer-input" class="answer-input" placeholder="Upiši prijevod">`;
        },
        
        // Generiranje zadatka za dopunjavanje
        generateFillInTask: function(word, questionContainer, answerContainer) {
            // TODO: Implementirati logiku za zadatke dopunjavanja
        },
        
        // Generiranje zadatka za povezivanje
        generateMatchingTask: function(questionContainer, answerContainer) {
            // TODO: Implementirati logiku za zadatke povezivanja
        },
        
        // Provjera odgovora
        checkAnswer: function() {
            const answerInput = document.getElementById('answer-input');
            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswer = this.currentTask.correctAnswer.toLowerCase();
            
            const isCorrect = userAnswer === correctAnswer;
            
            if (isCorrect) {
                this.handleCorrectAnswer();
            } else {
                this.handleWrongAnswer();
            }
            
            this.updateUI();
        },
        
        // Obrada točnog odgovora
        handleCorrectAnswer: function() {
            this.score += 10;
            this.streak += 1;
            this.correctAnswers += 1;
            this.bestStreak = Math.max(this.streak, this.bestStreak);
            
            document.getElementById('feedback').innerHTML = '<div class="correct-feedback">Točno! 🎉</div>';
            document.getElementById('check-answer').disabled = true;
            document.getElementById('next-task').disabled = false;
        },
        
        // Obrada netočnog odgovora
        handleWrongAnswer: function() {
            this.streak = 0;
            this.wrongAnswers += 1;
            
            document.getElementById('feedback').innerHTML = `
                <div class="wrong-feedback">
                    Netočno! Točan odgovor je: ${this.currentTask.correctAnswer}
                </div>
            `;
            document.getElementById('check-answer').disabled = true;
            document.getElementById('next-task').disabled = false;
        },
        
        // Ažuriranje korisničkog sučelja
        updateUI: function() {
            document.getElementById('score').textContent = this.score;
            document.getElementById('streak').textContent = this.streak;
            document.getElementById('correct-answers').textContent = this.correctAnswers;
            document.getElementById('wrong-answers').textContent = this.wrongAnswers;
            document.getElementById('best-streak').textContent = this.bestStreak;
            
            // Ažuriranje progress bara
            const progress = (this.streak / 10) * 100; // 10 je maksimalni streak za sljedeću razinu
            document.getElementById('level-progress').style.width = `${Math.min(progress, 100)}%`;
        }
    };
    
    // Pokretanje aplikacije
    app.init();
});
</script>

<?php get_footer(); ?>
