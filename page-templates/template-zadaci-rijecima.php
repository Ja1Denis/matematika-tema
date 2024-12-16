<?php
/**
 * Template Name: Zadaci Riječima Do 20
 * 
 * @package matematika-tema
 */

// Enqueue potrebne skripte i stilovi
function zadaci_rijecima_scripts() {
    // Provjeri jesmo li na pravoj stranici
    if (!is_page_template('page-templates/template-zadaci-rijecima.php')) {
        return;
    }

    wp_enqueue_style(
        'zadaci-rijecima-style',
        get_template_directory_uri() . '/assets/css/zadaci-rijecima.css',
        array(),
        '1.0.0'
    );

    // Prvo učitaj pomoćne skripte
    wp_enqueue_script(
        'zadaci-rijecima-names',
        get_template_directory_uri() . '/assets/js/names.js',
        array('jquery'),
        '1.0.0',
        true
    );

    wp_enqueue_script(
        'zadaci-rijecima-declension',
        get_template_directory_uri() . '/assets/js/declension.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // Zatim učitaj tasks.js koji ovisi o names.js i declension.js
    wp_enqueue_script(
        'zadaci-rijecima-tasks',
        get_template_directory_uri() . '/assets/js/tasks.js',
        array('jquery', 'zadaci-rijecima-names', 'zadaci-rijecima-declension'),
        '1.0.0',
        true
    );

    // Na kraju učitaj glavnu skriptu koja ovisi o svima ostalima
    wp_enqueue_script(
        'zadaci-rijecima-script',
        get_template_directory_uri() . '/assets/js/script.js',
        array('jquery', 'zadaci-rijecima-tasks'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'zadaci_rijecima_scripts');

get_header(); ?>

<main id="primary" class="site-main">
    <div class="main-content">
        <div class="container">
            <h1><?php the_title(); ?></h1>
            <div class="task-container">
                <div id="taskText" class="task-text"></div>
                <div class="input-container">
                    <input type="number" id="userAnswer" placeholder="Upiši svoj odgovor">
                </div>
                <div class="controls">
                    <button id="newTask" class="button">Novi zadatak</button>
                    <button id="checkAnswer" class="button">Provjeri</button>
                    <button id="printTasks" class="button">Ispiši zadatke</button>
                </div>
            </div>
            <div id="result" class="result"></div>
            <div id="score" class="score">Bodovi: 0</div>
        </div>
    </div>

    <!-- Kontejner za print preview -->
    <div id="printPreview" class="print-preview">
        <div class="print-preview-content">
            <div class="print-preview-header">
                <h2>Zadaci Riječima Do 20</h2>
                <div class="print-preview-controls">
                    <button id="doPrint" class="button">Ispiši</button>
                    <button id="closePreview" class="button">Zatvori</button>
                </div>
            </div>
            <div id="printTaskList" class="print-task-list"></div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
