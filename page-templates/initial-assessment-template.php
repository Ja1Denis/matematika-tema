<?php
/**
 * Template Name: Inicijalna Procjena
 * 
 * @package MatematikaPRO
 */

get_header(); ?>

<main class="initial-assessment">
    <div id="assessment-app">
        <!-- Početni ekran za odabir -->
        <div id="grade-selection" class="grade-selection-container">
            <h2>Odaberi razinu procjene</h2>
            <p class="selection-description">Odaberi razred za koji želiš procjenu znanja ili odaberi opću procjenu koja će provjeriti tvoje znanje kroz sve razrede.</p>
            
            <div class="grade-options">
                <!-- Niži razredi -->
                <div class="grade-group lower-grades">
                    <h3 class="group-title">Niži razredi (1-4)</h3>
                    <div class="grade-grid">
                        <div class="grade-option" data-grade="1">
                            <h3>1. razred</h3>
                            <p>Provjeri svoje znanje za 1. razred</p>
                        </div>
                        <div class="grade-option" data-grade="2">
                            <h3>2. razred</h3>
                            <p>Provjeri svoje znanje za 2. razred</p>
                        </div>
                        <div class="grade-option" data-grade="3">
                            <h3>3. razred</h3>
                            <p>Provjeri svoje znanje za 3. razred</p>
                        </div>
                        <div class="grade-option" data-grade="4">
                            <h3>4. razred</h3>
                            <p>Provjeri svoje znanje za 4. razred</p>
                        </div>
                    </div>
                </div>

                <!-- Viši razredi -->
                <div class="grade-group higher-grades">
                    <h3 class="group-title">Viši razredi (5-8)</h3>
                    <div class="grade-grid">
                        <div class="grade-option" data-grade="5">
                            <h3>5. razred</h3>
                            <p>Provjeri svoje znanje za 5. razred</p>
                        </div>
                        <div class="grade-option" data-grade="6">
                            <h3>6. razred</h3>
                            <p>Provjeri svoje znanje za 6. razred</p>
                        </div>
                        <div class="grade-option" data-grade="7">
                            <h3>7. razred</h3>
                            <p>Provjeri svoje znanje za 7. razred</p>
                        </div>
                        <div class="grade-option" data-grade="8">
                            <h3>8. razred</h3>
                            <p>Provjeri svoje znanje za 8. razred</p>
                        </div>
                    </div>
                </div>

                <!-- Opća procjena -->
                <div class="grade-option general" data-grade="all">
                    <h3>Opća procjena</h3>
                    <p>Provjeri svoje znanje kr oz sve razrede</p>
                </div>
            </div>
        </div>

        <!-- Procjena -->
        <div id="assessment-content" style="display: none;">
            <div class="assessment-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">Pitanje <span id="current-question">1</span> od <span id="total-questions">10</span></span>
            </div>

            <div class="question-container">
                <div id="question-text" class="question-text"></div>
                <div id="answers" class="answers-grid"></div>
            </div>

            <div class="navigation-buttons">
                <button id="prev-btn" class="btn-secondary" style="display: none;">Prethodno</button>
                <button id="next-btn" class="btn-primary">Sljedeće</button>
                <button id="finish-btn" class="btn-primary" style="display: none;">Završi</button>
            </div>
        </div>

        <!-- Rezultati -->
        <div id="results" class="results-container" style="display: none;">
            <h2>Rezultati procjene</h2>
            <div class="results-content">
                <div class="score-summary"></div>
                <div class="recommendations"></div>
            </div>
            <button id="restart-btn" class="btn-primary">Nova procjena</button>
        </div>
    </div>
</main>

<?php 
// Dodajemo JavaScript
wp_enqueue_script('assessment-js', get_template_directory_uri() . '/js/assessment.js', array('jquery'), '1.0', true);

// Dodajemo podatke za JavaScript
wp_localize_script('assessment-js', 'assessmentData', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('assessment_nonce')
));

get_footer(); ?>
