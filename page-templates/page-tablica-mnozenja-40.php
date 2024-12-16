<?php
/**
 * Template Name: Tablica Množenja do 40
 * Description: Predložak za interaktivnu tablicu množenja s brojevima do 40
 */

get_header(); 

// Dodaj nonce za sigurnost
$nonce = wp_create_nonce('tablica_mnozenja_40_nonce');
?>

<div class="container tablica-mnozenja-40-wrapper">
    <header class="tablica-header">
        <h1><?php the_title(); ?></h1>
        <div class="controls">
            <button id="startTest" class="btn btn-primary">Započni Test</button>
            <button id="generirajZadatke" class="btn btn-secondary">Generiraj Nove Zadatke</button>
            <button id="printButton" class="btn btn-info">Isprintaj</button>
        </div>
        <div class="test-info" style="display: none;">
            <div class="timer">Preostalo vrijeme: <span id="vrijeme">300</span>s</div>
            <div class="score">Bodovi: <span id="bodovi">0</span>/10</div>
        </div>
    </header>

    <main class="tablica-main">
        <div class="tablica-container">
            <h2>Tablica Množenja</h2>
            <table id="tablicaMnozenja40" class="tablica-mnozenja-40">
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

    <!-- Print Modal -->
    <div id="printModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Zadaci za ispis</h2>
            <ol id="printTaskList"></ol>
            <button class="btn btn-print" onclick="window.print()">Ispiši</button>
        </div>
    </div>
</div>

<?php
// Registracija i učitavanje potrebnih skripti i stilova
function tablica_mnozenja_40_scripts() {
    // Registracija i učitavanje CSS-a
    wp_enqueue_style(
        'tablica-mnozenja-40-style',
        get_template_directory_uri() . '/assets/css/tablica-mnozenja-40.css',
        array(),
        '1.0.0'
    );

    // Registracija i učitavanje JavaScript-a
    wp_enqueue_script(
        'tablica-mnozenja-40-script',
        get_template_directory_uri() . '/assets/js/tablica-mnozenja-40.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // Dodaj nonce i URL-ove u JavaScript
    wp_localize_script(
        'tablica-mnozenja-40-script',
        'tablicaMnozenja40Data',
        array(
            'nonce' => wp_create_nonce('tablica_mnozenja_40_nonce'),
            'ajaxurl' => admin_url('admin-ajax.php')
        )
    );
}
add_action('wp_enqueue_scripts', 'tablica_mnozenja_40_scripts');

get_footer();
?>
