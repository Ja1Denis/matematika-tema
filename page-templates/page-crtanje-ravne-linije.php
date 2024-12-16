<?php
/**
 * Template Name: Crtanje Ravne Linije
 * Description: Predložak za aplikaciju crtanja ravnih linija
 */

get_header(); ?>

<div class="container">
    <header>
        <h1>Nacrtaj ravnu liniju! 📏</h1>
        <div class="score-container">
            <div class="score">Bodovi: <span id="score">0</span></div>
            <div class="level">Razina: <span id="level">1</span></div>
            <div class="high-score">Najbolji rezultat: <span id="highScore">0</span></div>
        </div>
    </header>

    <main>
        <div class="difficulty-controls">
            <button id="easyMode" class="button active">Lagano</button>
            <button id="mediumMode" class="button">Srednje</button>
            <button id="hardMode" class="button">Teško</button>
        </div>

        <div class="task-container">
            <div class="task-card">
                <div id="task" class="task">
                    Nacrtaj ravnu liniju koja prolazi kroz označene točke i siječe zadanu liniju
                </div>
                <div class="timer" id="timer">Preostalo vrijeme: <span>30</span>s</div>
            </div>
        </div>

        <div class="canvas-container">
            <canvas id="drawingCanvas"></canvas>
        </div>

        <div class="controls">
            <button id="newTask" class="button">Novi zadatak</button>
            <button id="checkLine" class="button">Provjeri</button>
            <button id="clearCanvas" class="button">Obriši</button>
            <button id="hint" class="button">Pomoć</button>
            <button id="toggleSound" class="button">🔊 Zvuk</button>
            <button id="printTasks" class="button">🖨️ Ispiši zadatke</button>
        </div>

        <div id="feedback" class="feedback hidden">
            <!-- Ovdje će se prikazivati povratne informacije -->
        </div>
    </main>
</div>

<!-- Audio elementi -->
<audio id="correctSound" src="<?php echo get_theme_file_uri('assets/sounds/correct.mp3'); ?>"></audio>
<audio id="wrongSound" src="<?php echo get_theme_file_uri('assets/sounds/wrong.mp3'); ?>"></audio>
<audio id="levelUpSound" src="<?php echo get_theme_file_uri('assets/sounds/levelup.mp3'); ?>"></audio>

<?php
// Registracija i učitavanje potrebnih skripti i stilova
function crtanje_ravne_linije_scripts() {
    wp_enqueue_style(
        'crtanje-ravne-linije-style',
        get_theme_file_uri('assets/css/crtanje-ravne-linije.css'),
        array(),
        '1.0.0'
    );

    wp_enqueue_script(
        'crtanje-ravne-linije-script',
        get_theme_file_uri('assets/js/crtanje-ravne-linije.js'),
        array(),
        '1.0.0',
        true
    );

    // Prosljeđivanje podataka u JavaScript
    wp_localize_script(
        'crtanje-ravne-linije-script',
        'crtanjeRavneLinije',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('crtanje_ravne_linije_nonce')
        )
    );
}
add_action('wp_enqueue_scripts', 'crtanje_ravne_linije_scripts');

get_footer(); ?>
