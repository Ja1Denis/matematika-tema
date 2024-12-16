<?php
/**
 * Template Name: Poveži sliku i riječ
 * Description: Template za aplikaciju povezivanja geometrijskih likova i njihovih naziva
 */

// Enqueue potrebni CSS i JS
wp_enqueue_style('comic-neue', 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
wp_enqueue_style('povezi-sliku-i-rijec-style', get_template_directory_uri() . '/assets/css/povezi-sliku-i-rijec.css');
wp_enqueue_script('povezi-sliku-i-rijec-script', get_template_directory_uri() . '/assets/js/povezi-sliku-i-rijec.js', array('jquery'), '1.0', true);

// Dodaj potrebne podatke za JavaScript
wp_localize_script('povezi-sliku-i-rijec-script', 'poveziSlikuIRijecData', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('povezi-sliku-i-rijec-nonce'),
    'themeUrl' => get_template_directory_uri()
));

get_header();
?>

<div class="povezi-sliku-i-rijec">
    <header>
        <h1>Poveži geometrijske likove! 📐</h1>
        <div class="score-container">
            <div class="score">Bodovi: <span id="score">0</span></div>
            <div class="level">Razina: <span id="level">1</span></div>
            <div class="high-score">Najbolji rezultat: <span id="highScore">0</span></div>
        </div>
    </header>

    <main>
        <div class="game-modes">
            <button id="basicMode" class="button mode-button active">Osnovni mod</button>
            <button id="propertiesMode" class="button mode-button">Svojstva</button>
            <button id="anglesMode" class="button mode-button">Kutovi</button>
            <button id="sidesMode" class="button mode-button">Stranice</button>
        </div>

        <div class="difficulty-controls">
            <button id="easyMode" class="button active">Lagano</button>
            <button id="mediumMode" class="button">Srednje</button>
            <button id="hardMode" class="button">Teško</button>
        </div>

        <div class="task-container">
            <div class="task-card">
                <div id="task" class="task">
                    Poveži geometrijske likove
                </div>
            </div>
        </div>

        <div class="game-container">
            <div id="images-container" class="images-container"></div>
            <div id="words-container" class="words-container"></div>
        </div>

        <div class="controls">
            <button id="newTask" class="button">Novi zadatak</button>
            <button id="checkAnswer" class="button">Provjeri</button>
            <button id="hint" class="button">Pomoć</button>
            <button id="toggleSound" class="button">🔊 Zvuk</button>
            <button id="printTasks" class="button">🖨️ Ispiši zadatke</button>
        </div>

        <div id="feedback" class="feedback hidden">
            <!-- Ovdje će se prikazivati povratne informacije -->
        </div>

        <div id="funFact" class="fun-fact hidden">
            <!-- Ovdje će se prikazivati zanimljive činjenice -->
        </div>

        <div id="tooltip" class="tooltip hidden">
            <!-- Ovdje će se prikazivati opisi likova -->
        </div>
    </main>
</div>

<?php get_footer(); ?>
