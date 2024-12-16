<?php
/**
 * Template Name: Tablica Množenja
 */

get_header();

// Registriraj skripte i stilove
wp_enqueue_style('tablica-mnozenja-style', get_template_directory_uri() . '/assets/css/tablica-mnozenja.css');
wp_enqueue_script('tablica-mnozenja-script', get_template_directory_uri() . '/assets/js/tablica-mnozenja.js', array('jquery'), '1.0', true);

// Lokaliziraj skriptu
wp_localize_script('tablica-mnozenja-script', 'tablicaMnozenjaObj', array(
    'zvukovi_url' => get_template_directory_uri() . '/assets/zvukovi/',
));

?>

<div class="tablica-mnozenja-container">
    <header>
        <h1>Tablica množenja do 10</h1>
    </header>

    <div class="controls">
        <button id="startTest">Započni test</button>
        <button id="generirajZadatke">Generiraj nove zadatke</button>
        <button id="printButton">Ispiši zadatke</button>
    </div>

    <div class="test-info">
        <div class="timer">
            Preostalo vrijeme: <span id="vrijeme">300</span>s
        </div>
        <div class="bodovi">
            Bodovi: <span id="bodovi">0</span>/10
        </div>
    </div>

    <main>
        <div class="tablica-container">
            <table id="tablicaMnozenja"></table>
        </div>

        <div class="zadaci-container">
            <h2>Zadaci</h2>
            <div id="zadaci"></div>
        </div>
    </main>

    <!-- Print Modal -->
    <div id="printModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Zadaci za ispis</h2>
            <ol id="printTaskList"></ol>
            <div class="print-controls">
                <button class="print-button" onclick="window.print()">
                    <i class="fa fa-print"></i> Ispiši zadatke
                </button>
            </div>
        </div>
    </div>
</div>

<?php get_footer(); ?>
