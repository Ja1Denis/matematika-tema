<?php
/**
 * Template Name: Matematička Igra
 * Description: Predložak za interaktivnu matematičku igru s brojevima.
 */

get_header(); ?>

<div class="container">
    <div class="game-container">
        <div class="card-header">
            <h1 class="card-title">Matematička Igra Brojeva</h1>
        </div>
        <div class="card-content">
            <div class="difficulty-selector">
                <select id="difficultySelect" class="select">
                    <option value="easy">Lagano (1-30)</option>
                    <option value="medium">Srednje (1-60)</option>
                    <option value="hard">Teško (1-100)</option>
                </select>
            </div>

            <div class="button-group">
                <button id="printExercises" class="button print-button">
                    <i class="fas fa-print"></i> Ispiši 10 zadataka
                </button>
            </div>

            <div id="gameView" class="game-view">
                <div class="number-display">
                    <span id="currentNumber" class="number">0</span>
                </div>

                <div class="answer-section">
                    <input type="text" id="textAnswer" class="form-control" placeholder="Upiši broj slovima...">
                </div>

                <div class="button-group">
                    <button id="checkAnswer" class="button">Provjeri</button>
                    <button id="newNumber" class="button">Novi broj</button>
                    <button id="speakButton" class="button">
                        <i class="fas fa-volume-up"></i> Izgovori
                    </button>
                </div>

                <div class="feedback-section">
                    <div id="feedback" class="feedback-display"></div>
                    <div id="checkmark" class="checkmark-container">
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                </div>

                <div class="score-display">
                    <div id="stars" class="stars">
                        <span class="star">☆</span>
                        <span class="star">☆</span>
                        <span class="star">☆</span>
                        <span class="star">☆</span>
                        <span class="star">☆</span>
                    </div>
                    <p class="score-text">Bodovi: <span id="scoreDisplay">0</span></p>
                </div>
            </div>

            <div id="printView" class="print-view">
                <div class="print-exercises">
                    <h2>Vježba: Brojevi Riječima</h2>
                    <div id="exercisesList" class="exercises-list"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
// Registracija stilova i skripti specifičnih za ovu stranicu
function enqueue_matematicka_igra_assets() {
    if (is_page_template('page-templates/matematicka-igra.php')) {
        wp_enqueue_style(
            'matematicka-igra-style',
            get_template_directory_uri() . '/css/matematicka-igra.css',
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'matematicka-igra-script',
            get_template_directory_uri() . '/js/matematicka-igra.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'enqueue_matematicka_igra_assets');
?>

<?php get_footer(); ?>
