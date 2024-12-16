<?php
/**
 * Template Name: Oduzimanje do 20
 * Description: Template za aplikaciju vježbanja oduzimanja brojeva do 20
 */

// Učitavamo potrebne skripte i stilove
wp_enqueue_style('comic-neue-font', 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
wp_enqueue_style('oduzimanje-style', get_stylesheet_directory_uri() . '/assets/css/oduzimanje.css');
wp_enqueue_script('oduzimanje-script', get_stylesheet_directory_uri() . '/assets/js/oduzimanje.js', array('jquery'), '1.0', true);

// Dodajemo podatke za JavaScript
wp_localize_script('oduzimanje-script', 'mathAppData', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('math_app_nonce'),
    'user_id' => get_current_user_id()
));

get_header(); 
?>

<div class="oduzimanje-app">
    <div class="container">
        <header>
            <h1>Oduzimanje do 20 &#x1F3AF;</h1>
            <div id="score" class="score">Rezultat: 0/0 (0%)</div>
        </header>

        <div class="task-container">
            <div class="task-card">
                <div id="task" class="task"></div>
                
                <div id="options" class="options">
                    <!-- Options will be dynamically generated -->
                </div>
                
                <div id="inputContainer" class="input-container" style="display: none;">
                    <input type="number" id="userInput" min="0" max="20" placeholder="Upiši odgovor">
                </div>
                
                <div id="feedback" class="feedback"></div>
            </div>
        </div>

        <div class="controls">
            <button id="toggleInput" class="button">Prebaci na unos</button>
            <button id="hint" class="button">Pomoć</button>
            <button id="print" class="button">Isprintaj zadatke</button>
            <button id="next" class="button" style="display: none;">Sljedeći zadatak</button>
        </div>

        <div id="printArea" style="display: none;"></div>
    </div>
</div>

<?php get_footer(); ?>
