<?php
/**
 * Template Name: Tablica Množenja Do 30
 * 
 * @package MatematikaPro
 */

get_header(); ?>

<div class="container tablica-mnozenja-30">
    <header>
        <h1><?php the_title(); ?></h1>
        <div class="controls">
            <button id="startTest">Započni Test</button>
            <button id="generirajZadatke">Generiraj Nove Zadatke</button>
            <button id="printButton">Pripremi za Ispis</button>
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
        <h2>Priprema za Ispis</h2>
        <div class="print-area">
            <div class="print-tablica">
                <h3>Tablica Množenja</h3>
                <div id="printTablica"></div>
            </div>
            <div class="print-zadaci">
                <h3>Zadaci za Vježbu</h3>
                <div id="printZadaci"></div>
            </div>
        </div>
        <div class="print-controls">
            <button id="printNow">Ispiši</button>
        </div>
    </div>
</div>

<?php
// Registracija i učitavanje CSS-a
wp_enqueue_style('tablica-mnozenja-30-style', get_template_directory_uri() . '/assets/css/tablica-mnozenja-30.css');

// Registracija i učitavanje JavaScript-a
wp_enqueue_script('tablica-mnozenja-30-script', get_template_directory_uri() . '/assets/js/tablica-mnozenja-30.js', array('jquery'), '1.0', true);

get_footer();
?>
