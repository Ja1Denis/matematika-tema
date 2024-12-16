<?php
/**
 * Template Name: Crtanje Ravne Linije
 * Description: Predložak stranice za vježbanje crtanja ravnih linija
 */

get_header(); ?>

<div class="page-wrapper crtanje-linije">
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
</div>

<!-- Audio elementi -->
<audio id="correctSound" preload="auto">
    <source src="<?php echo get_template_directory_uri(); ?>/assets/sounds/correct.mp3" type="audio/mpeg">
</audio>
<audio id="wrongSound" preload="auto">
    <source src="<?php echo get_template_directory_uri(); ?>/assets/sounds/wrong.mp3" type="audio/mpeg">
</audio>
<audio id="levelUpSound" preload="auto">
    <source src="<?php echo get_template_directory_uri(); ?>/assets/sounds/levelup.mp3" type="audio/mpeg">
</audio>

<?php get_footer(); ?>
