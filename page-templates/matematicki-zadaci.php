<?php
/**
 * Template Name: Matematički Zadaci
 */

get_header(); ?>

<div class="container mt-5">
    <div class="row">
        <div class="col-md-12">
            <div class="card shadow-sm">
                <div class="card-body">
                    <h1 class="text-center mb-4">Vježbaj pisanje brojeva</h1>
                    
                    <!-- Upute -->
                    <div class="alert alert-info mb-4">
                        <p class="mb-1"><strong>Upute:</strong></p>
                        <p class="mb-1">1. Napiši kako se čita prikazani broj</p>
                        <p class="mb-1">2. Za provjeru klikni "Provjeri odgovor"</p>
                        <p class="mb-0"><i class="fas fa-microphone"></i> <em>Savjet: Možeš koristiti glasovni unos na tipkovnici za brže pisanje</em></p>
                    </div>

                    <!-- Kontrole za odabir -->
                    <div class="controls mb-4">
                        <div class="form-group">
                            <label for="difficulty">Odaberi težinu:</label>
                            <select class="form-control" id="difficulty">
                                <option value="easy">Lagano (1-20)</option>
                                <option value="medium">Srednje (20-50)</option>
                                <option value="hard">Teško (50-100)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Prikaz zadatka -->
                    <div class="task-display text-center mb-4">
                        <div class="number-display">
                            <span id="currentNumber" class="display-1 animated"></span>
                        </div>
                        <div class="answer-input mt-4">
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <input type="number" id="numberAnswer" class="form-control form-control-lg text-center mb-3" 
                                           placeholder="Upiši broj znamenkama">
                                    <input type="text" id="userAnswer" class="form-control form-control-lg text-center" 
                                           placeholder="Upiši kako se čita ovaj broj">
                                    <button id="checkAnswer" class="btn btn-primary mt-3">Provjeri odgovor</button>
                                </div>
                            </div>
                        </div>
                        <div id="feedback" class="mt-3"></div>
                        <div id="score" class="mt-3">
                            <h4>Bodovi: <span id="scoreValue">0</span></h4>
                        </div>
                    </div>

                    <!-- Kontrole za zadatke -->
                    <div class="task-controls text-center">
                        <button id="newTask" class="btn btn-success">Novi zadatak</button>
                        <button id="printTasks" class="btn btn-info">Isprintaj zadatke za vježbu</button>
                    </div>

                    <!-- Print preview -->
                    <div id="printPreview" class="d-none">
                        <div class="row">
                            <div class="col-12">
                                <div id="tasksList"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php get_footer(); ?>
