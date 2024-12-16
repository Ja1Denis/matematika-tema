<?php
/**
 * Template Name: Završna Procjena
 * 
 * @package MatematikaPRO
 */

get_header(); ?>

<head>
    <!-- MathJax podrška -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>

<main class="final-assessment">
    <div id="assessment-app">
        <!-- Početni ekran -->
        <div id="assessment-intro" class="assessment-intro">
            <h2>Završna provjera znanja</h2>
            <p class="intro-description">Provjeri svoje znanje iz svih tema koje si učio/la tijekom godine.</p>
            
            <div class="grade-options">
                <!-- Niži razredi -->
                <div class="grade-group lower-grades">
                    <h3 class="group-title">Niži razredi (1-4)</h3>
                    <div class="grade-grid">
                        <div class="grade-option" data-grade="1">
                            <h3>1. razred</h3>
                            <p>Završna provjera za 1. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>45 minuta</span>
                                <span>25 pitanja</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="2">
                            <h3>2. razred</h3>
                            <p>Završna provjera za 2. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>45 minuta</span>
                                <span>25 pitanja</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="3">
                            <h3>3. razred</h3>
                            <p>Završna provjera za 3. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>60 minuta</span>
                                <span>30 pitanja</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="4">
                            <h3>4. razred</h3>
                            <p>Završna provjera za 4. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>60 minuta</span>
                                <span>30 pitanja</span>
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
                            <p>Završna provjera za 5. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>90 minuta</span>
                                <span>35 pitanja</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="6">
                            <h3>6. razred</h3>
                            <p>Završna provjera za 6. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>90 minuta</span>
                                <span>35 pitanja</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="7">
                            <h3>7. razred</h3>
                            <p>Završna provjera za 7. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>90 minuta</span>
                                <span>40 pitanja</span>
                            </div>
                        </div>
                        <div class="grade-option" data-grade="8">
                            <h3>8. razred</h3>
                            <p>Završna provjera za 8. razred</p>
                            <div class="topics-preview">
                                <span>5 tema</span>
                                <span>90 minuta</span>
                                <span>40 pitanja</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pregled provjere -->
        <div id="assessment-overview" class="assessment-overview" style="display: none;">
            <button class="back-button" id="back-to-intro">
                <span class="arrow">←</span> Natrag na odabir razreda
            </button>
            
            <div class="overview-content">
                <h2>Pregled završne provjere - <span class="current-grade"></span></h2>
                
                <div class="assessment-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span class="detail-label">Vrijeme:</span>
                        <span class="detail-value time-limit"></span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-tasks"></i>
                        <span class="detail-label">Broj pitanja:</span>
                        <span class="detail-value question-count"></span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-book"></i>
                        <span class="detail-label">Teme:</span>
                        <span class="detail-value topic-count"></span>
                    </div>
                </div>

                <div class="topics-overview">
                    <h3>Teme koje će biti obuhvaćene:</h3>
                    <div class="topics-list"></div>
                </div>

                <div class="instructions">
                    <h3>Upute</h3>
                    <ul>
                        <li>Provjera je vremenski ograničena</li>
                        <li>Ne možete se vratiti na prethodna pitanja</li>
                        <li>Rezultati će biti dostupni odmah nakon završetka</li>
                        <li>Provjerite da imate stabilnu internetsku vezu</li>
                    </ul>
                </div>

                <div class="overview-actions">
                    <button id="start-assessment" class="btn-primary">Započni provjeru</button>
                </div>
            </div>
        </div>

        <!-- Provjera -->
        <div id="assessment-content" class="assessment-content" style="display: none;">
            <div class="assessment-header">
                <div class="timer-container">
                    <i class="fas fa-clock"></i>
                    <span id="timer">00:00</span>
                </div>
                <div class="progress-info">
                    <span id="current-question">1</span> / <span id="total-questions">40</span>
                </div>
            </div>

            <div class="assessment-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>

            <div class="question-container">
                <div class="topic-indicator"></div>
                <div id="question-text" class="question-text"></div>
                <div id="question-image" class="question-image"></div>
                <div id="interactive-area" class="interactive-area"></div>
                <canvas id="drawing-canvas" class="drawing-canvas" style="display: none;"></canvas>
                <div id="answers" class="answers-grid"></div>
            </div>

            <div class="navigation-buttons">
                <button id="next-btn" class="btn-primary">Sljedeće pitanje</button>
                <button id="finish-btn" class="btn-primary" style="display: none;">Završi provjeru</button>
            </div>
        </div>

        <!-- Rezultati -->
        <div id="results" class="results-container" style="display: none;">
            <h2>Rezultati završne provjere</h2>
            
            <div class="results-content">
                <div class="score-summary">
                    <div class="final-score"></div>
                    <div class="time-taken"></div>
                </div>

                <div class="topic-breakdown">
                    <h3>Rezultati po temama</h3>
                    <div class="topic-results"></div>
                </div>

                <div class="skill-analysis">
                    <h3>Analiza vještina</h3>
                    <div class="skill-grid"></div>
                </div>

                <div class="recommendations">
                    <h3>Preporuke za daljnje učenje</h3>
                    <div class="recommendations-list"></div>
                </div>

                <div class="result-actions">
                    <button id="view-solutions" class="btn-secondary">Pregledaj rješenja</button>
                    <button id="download-results" class="btn-secondary">Preuzmi rezultate</button>
                    <button id="new-assessment" class="btn-primary">Nova provjera</button>
                </div>
            </div>
        </div>

        <!-- Pregled rješenja -->
        <div id="solutions" class="solutions-container" style="display: none;">
            <button class="back-button" id="back-to-results">
                <span class="arrow">←</span> Natrag na rezultate
            </button>

            <h2>Pregled rješenja</h2>
            <div class="solutions-list"></div>

            <div class="solutions-navigation">
                <button id="prev-solution" class="btn-secondary">Prethodno</button>
                <span class="solution-counter">1 / 40</span>
                <button id="next-solution" class="btn-secondary">Sljedeće</button>
            </div>
        </div>
    </div>
</main>

<?php 
// Dodajemo JavaScript
wp_enqueue_script('final-assessment-js', get_template_directory_uri() . '/js/final-assessment.js', array('jquery'), '1.0', true);

// Dodajemo podatke za JavaScript
wp_localize_script('final-assessment-js', 'assessmentData', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('assessment_nonce')
));

get_footer(); ?>
