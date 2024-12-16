<?php
/**
 * Template Name: Početna
 */

get_header(); ?>

<main>
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Dobrodošli u MatematikaPRO</h1>
            <p>Vaš put do matematičke izvrsnosti počinje ovdje</p>
            <div class="hero-buttons">
                <a href="#razredi" class="btn-primary">Započni učenje</a>
                <a href="#kako-radi" class="btn-secondary">Kako radi?</a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="kako-radi" class="features">
        <h2>Zašto MatematikaPRO?</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">📚</div>
                <h3>Prilagođeno gradivo</h3>
                <p>Sadržaj usklađen s hrvatskim obrazovnim standardima za sve razrede</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>Interaktivno učenje</h3>
                <p>Vježbe i zadaci koji potiču aktivno sudjelovanje i razumijevanje</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>Praćenje napretka</h3>
                <p>Detaljan uvid u napredak i područja koja zahtijevaju dodatnu pažnju</p>
            </div>
        </div>
    </section>

    <!-- Grades Section -->
    <section id="razredi" class="grades">
        <h2>Odaberite razred</h2>
        <div class="grades-grid">
            <a href="/predskolski-program" class="grade-card">
                <h3>Predškolski program</h3>
                <p>Prvi koraci u svijet matematike</p>
            </a>
            <?php
            for ($i = 1; $i <= 8; $i++) {
                echo '<a href="/' . $i . '-razred" class="grade-card">
                    <h3>' . $i . '. razred</h3>
                    <p>Program za ' . $i . '. razred osnovne škole</p>
                </a>';
            }
            ?>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
        <div class="cta-content">
            <h2>Spremni za početak?</h2>
            <p>Pridružite nam se i započnite svoje matematičko putovanje već danas!</p>
            <a href="#" class="btn-primary">Registrirajte se besplatno</a>
        </div>
    </section>
</main>

<?php get_footer(); ?>
