<?php
/**
 * Template Name: Brojevna Linija Do 20
 */

get_header(); ?>

<div class="container brojevna-linija-container">
    <header>
        <h1>Brojevna linija do 20! 🎯</h1>
        <div class="score">Bodovi: <span id="score">0</span></div>
    </header>

    <main>
        <div class="task-container">
            <div class="task-card">
                <div id="task" class="task">
                    <!-- Ovdje će se generirati zadatak -->
                </div>
            </div>
        </div>

        <div class="canvas-container">
            <canvas id="numberLine"></canvas>
            <div class="number-line-controls">
                <button id="stepBackward" class="control-button">⬅️</button>
                <button id="stepForward" class="control-button">➡️</button>
            </div>
        </div>

        <div class="input-container">
            <input type="number" id="userInput" placeholder="Upiši odgovor" min="0" max="20">
            <button id="submitAnswer" class="button">Provjeri</button>
        </div>

        <div class="controls">
            <button id="newTask" class="button">Novi zadatak</button>
            <button id="hint" class="button">Pomoć</button>
            <button id="toggleOperation" class="button">Promijeni operaciju</button>
            <button id="printTasks" class="button">Isprintaj zadatke</button>
        </div>

        <div id="feedback" class="feedback hidden">
            <!-- Ovdje će se prikazivati povratne informacije -->
        </div>

        <!-- Dio za printanje -->
        <div id="printSection" class="print-only">
            <h2>Zadaci za vježbu</h2>
            <div id="printTasks"></div>
        </div>
    </main>
</div>

<?php
wp_enqueue_style('brojevna-linija-style', get_template_directory_uri() . '/css/brojevna-linija.css');
wp_enqueue_script('brojevna-linija-script', get_template_directory_uri() . '/js/brojevna-linija.js', array('jquery'), '1.0', true);

get_footer(); ?>
