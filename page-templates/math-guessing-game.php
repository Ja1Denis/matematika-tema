<?php
/**
 * Template Name: Učenje Brojeva
 * Description: Predložak za aplikaciju učenja brojeva
 */

get_header();
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
        <div class="number-learning-app">
            <div class="game-container">
                <div class="print-section">
                    <button id="print-worksheet" class="print-btn">
                        <i class="fas fa-print"></i>
                        Ispiši radni list
                    </button>
                    <select id="print-difficulty" class="print-select">
                        <option value="easy">Lagano (1-10)</option>
                        <option value="medium">Srednje (10-99)</option>
                        <option value="hard">Teško (100-999)</option>
                    </select>
                </div>

                <div class="score-container">
                    <div class="score">
                        <i class="fas fa-trophy"></i>
                        <span id="score">0</span>
                    </div>
                    <div class="streak-stars" id="streak-stars"></div>
                </div>

                <div class="level-progress">
                    <span>Nivo: <span id="current-level">lagano</span></span>
                    <div class="progress-bar">
                        <div class="progress" id="streak-progress"></div>
                    </div>
                </div>

                <div class="task-container">
                    <div class="question" id="question"></div>
                    <div class="input-container">
                        <input type="text" id="answer-input" placeholder="Upiši svoj odgovor...">
                        <button class="sound-btn" id="sound-btn">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div class="feedback" id="feedback"></div>
                    <div class="button-container">
                        <button class="check-btn" id="check-btn">Provjeri</button>
                        <button class="next-btn" id="next-btn">
                            Sljedeći <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <div class="difficulty-buttons">
                    <button class="difficulty-btn active" data-level="easy">Lagano</button>
                    <button class="difficulty-btn" data-level="medium">Srednje</button>
                    <button class="difficulty-btn" data-level="hard">Teško</button>
                </div>
            </div>

            <div class="game-instructions">
                <h2>Kako igrati?</h2>
                <ol>
                    <li>Odaberite težinu igre (lagano, srednje ili teško)</li>
                    <li>Pročitajte broj koji se prikazuje</li>
                    <li>Upišite taj broj riječima na hrvatskom jeziku</li>
                    <li>Kliknite "Provjeri" ili pritisnite Enter za provjeru odgovora</li>
                    <li>Kliknite "Sljedeći" za novi zadatak</li>
                </ol>
                <p>Savjet: Koristite gumb sa zvučnikom da čujete izgovor broja!</p>
            </div>
        </div>
    </div>
</main>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/number-learning.css">
<script src="<?php echo get_template_directory_uri(); ?>/js/number-learning.js"></script>

<?php get_footer(); ?>