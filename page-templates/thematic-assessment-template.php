<?php
/**
 * Template Name: Tematska Procjena
 * 
 * @package MatematikaPRO
 */

get_header(); ?>

<head>
    <!-- MathJax podrška -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>

<main class="thematic-assessment">
    <div id="assessment-app">
        <!-- Početni ekran za odabir -->
        <div id="grade-selection" class="grade-selection-container">
            <h2>Odaberi razred za tematsku provjeru</h2>
            <p class="selection-description">Odaberi razred za koji želiš provjeriti znanje iz određene teme.</p>
            
            <div class="grade-options">
                <!-- Niži razredi -->
                <div class="grade-group lower-grades">
                    <h3 class="group-title">Niži razredi (1-4)</h3>
                    <div class="grade-grid">
                        <div class="grade-option" data-grade="1">
                            <h3>1. razred</h3>
                            <p>Tematske provjere za 1. razred</p>
                            <div class="topics-preview">
                                <span>Zbrajanje</span>
                                <span>Oduzimanje</span>
                                <span>Oblici</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="2">
                            <h3>2. razred</h3>
                            <p>Tematske provjere za 2. razred</p>
                            <div class="topics-preview">
                                <span>Množenje</span>
                                <span>Dijeljenje</span>
                                <span>Razlomci</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="3">
                            <h3>3. razred</h3>
                            <p>Tematske provjere za 3. razred</p>
                            <div class="topics-preview">
                                <span>Decimalni brojevi</span>
                                <span>Površina</span>
                                <span>Opseg</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="4">
                            <h3>4. razred</h3>
                            <p>Tematske provjere za 4. razred</p>
                            <div class="topics-preview">
                                <span>Kutovi</span>
                                <span>Koordinate</span>
                                <span>Simetrija</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Viši razredi -->
                <div class="grade-group higher-grades">
                    <h3 class="group-title">Viši razredi (5-8)</h3>
                    <div class="grade-grid">
                        <div class="grade-option" data-grade="5">
                            <h3>5. razred</h3>
                            <p>Tematske provjere za 5. razred</p>
                            <div class="topics-preview">
                                <span>Razlomci</span>
                                <span>Decimalni brojevi</span>
                                <span>Postoci</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="6">
                            <h3>6. razred</h3>
                            <p>Tematske provjere za 6. razred</p>
                            <div class="topics-preview">
                                <span>Cijeli brojevi</span>
                                <span>Linearne jednadžbe</span>
                                <span>Trokuti</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="7">
                            <h3>7. razred</h3>
                            <p>Tematske provjere za 7. razred</p>
                            <div class="topics-preview">
                                <span>Proporcionalnost</span>
                                <span>Algebarski izrazi</span>
                                <span>Kružnica</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="8">
                            <h3>8. razred</h3>
                            <p>Tematske provjere za 8. razred</p>
                            <div class="topics-preview">
                                <span>Kvadriranje</span>
                                <span>Pitagorin poučak</span>
                                <span>Vektori</span>
                                <span>+2 teme</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Odabir teme -->
        <div id="topic-selection" class="topic-selection-container" style="display: none;">
            <button class="back-button" id="back-to-grades">
                <span class="arrow">←</span> Natrag na odabir razreda
            </button>
            <h2>Odaberi temu za provjeru</h2>
            <p class="selection-description">Odaberi temu iz koje želiš provjeriti svoje znanje.</p>
            
            <div class="topics-grid">
                <!-- Teme će biti dinamički dodane kroz JavaScript -->
            </div>
        </div>

        <!-- Procjena -->
        <div id="assessment-content" style="display: none;">
            <div class="assessment-header">
                <button class="back-button" id="back-to-topics">
                    <span class="arrow">←</span> Natrag na odabir teme
                </button>
                <div class="assessment-info">
                    <span class="current-grade"></span> | <span class="current-topic"></span>
                </div>
            </div>

            <div class="assessment-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">Pitanje <span id="current-question">1</span> od <span id="total-questions">10</span></span>
            </div>

            <div class="question-container">
                <div id="question-text" class="question-text"></div>
                <div id="question-image" class="question-image"></div>
                <div id="interactive-area" class="interactive-area"></div>
                <canvas id="drawing-canvas" class="drawing-canvas" style="display: none;"></canvas>
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
            <h2>Rezultati provjere</h2>
            <div class="results-content">
                <div class="score-summary"></div>
                <div class="topic-mastery"></div>
                <div class="recommendations"></div>
            </div>
            <div class="result-actions">
                <button id="retry-topic-btn" class="btn-secondary">Ponovi ovu temu</button>
                <button id="new-topic-btn" class="btn-primary">Odaberi novu temu</button>
                <button id="restart-btn" class="btn-primary">Nova provjera</button>
            </div>
        </div>
    </div>
</main>

<?php 
// Dodajemo JavaScript
wp_enqueue_script('thematic-assessment-js', get_template_directory_uri() . '/js/thematic-assessment.js', array('jquery'), '1.0', true);

// Dodajemo podatke za JavaScript
wp_localize_script('thematic-assessment-js', 'assessmentData', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('assessment_nonce')
));

get_footer(); ?>
