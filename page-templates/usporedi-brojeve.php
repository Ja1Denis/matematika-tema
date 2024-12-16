<?php
/**
 * Template Name: Usporedi Brojeve
 * 
 * Predložak za igru uspoređivanja brojeva
 */

get_header(); ?>

<div class="usporedi-brojeve-wrapper">
    <!-- Gumb za povratak -->
<div class="back-button-container">
    <a href="javascript:history.back()" class="back-button">
        <svg viewBox="0 0 24 24" width="24" height="24" class="back-icon">
            <path d="M15 18L9 12L15 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Povratak na prethodni izbornik
    </a>
</div>      
    <div class="game-container">
        <div class="game-card">
            <div class="card-header">
                <h2 class="card-title">Usporedi brojeve</h2>
            </div>
            <div class="card-content">
                <div class="score-container">
                    <span class="badge">Bodovi: <span id="score">0</span></span>
                    <span class="badge">Točnost: <span id="accuracy">0</span>%</span>
                </div>

                <div class="numbers-container">
                    <span class="number" id="number1">1</span>
                    <span class="question-mark">?</span>
                    <span class="number" id="number2">2</span>
                </div>

                <div class="buttons-container">
                    <button class="game-button" onclick="handleAnswer('<')">&lt;</button>
                    <button class="game-button" onclick="handleAnswer('=')">=</button>
                    <button class="game-button" onclick="handleAnswer('>')">&gt;</button>
                </div>

                <div id="feedback" class="feedback hidden"></div>

                <div class="reset-container">
                    <button class="reset-button" onclick="resetGame()">
                        <svg class="refresh-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M23 4C23 2.89543 22.1046 2 21 2H3C1.89543 2 1 2.89543 1 4V20C1 21.1046 1.89543 22 3 22H21C22.1046 22 23 21.1046 23 20V4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 5L21 3L19 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Nova igra
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
// Učitavanje CSS-a i JavaScript-a za igru
wp_enqueue_style('usporedi-brojeve-style', get_template_directory_uri() . '/css/number-comparison-game.css', array(), '1.0.0');
wp_enqueue_script('usporedi-brojeve-script', get_template_directory_uri() . '/js/number-comparison-game.js', array(), '1.0.0', true);
?>

<?php get_footer(); ?>
