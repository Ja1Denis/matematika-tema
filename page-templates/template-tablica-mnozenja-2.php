<?php
/**
 * Template Name: Tablica Množenja Broja 2
 * Description: Template za interaktivnu tablicu množenja broja 2
 */

// Dodajemo CSS i JavaScript
function tablica_mnozenja_2_enqueue_assets() {
    wp_enqueue_style('tablica-mnozenja-2-style', get_template_directory_uri() . '/assets/css/tablica-mnozenja-2.css');
    wp_enqueue_script('tablica-mnozenja-2-script', get_template_directory_uri() . '/assets/js/tablica-mnozenja-2.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'tablica_mnozenja_2_enqueue_assets');

get_header(); ?>

<div class="container">
    <header>
        <h1>Tablica množenja broja 2</h1>
        <div class="controls">
            <button id="startTest">Započni Test</button>
            <button id="generirajZadatke">Generiraj Nove Zadatke</button>
            <button id="printButton">Isprintaj</button>
        </div>
        <div class="test-info" style="display: none;">
            <div class="timer">Preostalo vrijeme: <span id="vrijeme">300</span>s</div>
            <div class="score">Bodovi: <span id="bodovi">0</span>/10</div>
        </div>
    </header>

    <main>
        <div class="tablica-container">
            <h2>Tablica Množenja</h2>
            <table id="tablicaMnozenja">
                <!-- Tablica će biti generirana kroz JavaScript -->
            </table>
        </div>

        <div class="zadaci-container">
            <h2>Zadaci za Vježbu</h2>
            <div id="zadaci">
                <!-- Zadaci će biti generirani kroz JavaScript -->
            </div>
        </div>
    </main>
</div>

<!-- Print Modal -->
<div id="printModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Zadaci za ispis</h2>
        <div class="print-content">
            <div class="print-tablica">
                <h3>Tablica množenja broja 2</h3>
                <table id="printTablica"></table>
            </div>
            <div class="print-zadaci">
                <h3>Zadaci za vježbu</h3>
                <ol id="printTaskList"></ol>
            </div>
        </div>
        <button onclick="window.print()">Ispiši</button>
    </div>
</div>

<?php get_footer(); ?>
