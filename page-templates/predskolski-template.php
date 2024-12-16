<?php
/**
 * Template Name: Predškolski Program
 */

get_header(); ?>

<main>
    <section class="grade-content">
        <h1><?php the_title(); ?></h1>
        <div class="topics-grid">
            <div class="topic-card">
                <h3>Brojevi i brojanje</h3>
                <ul>
                    <li><a href="#">Brojanje do 10</a></li>
                    <li><a href="#">Prepoznavanje brojeva</a></li>
                    <li><a href="#">Uspoređivanje količina</a></li>
                </ul>
            </div>
            <div class="topic-card">
                <h3>Oblici i boje</h3>
                <ul>
                    <li><a href="#">Osnovni geometrijski oblici</a></li>
                    <li><a href="#">Prepoznavanje boja</a></li>
                    <li><a href="#">Sortiranje predmeta</a></li>
                </ul>
            </div>
            <div class="topic-card">
                <h3>Prostorni odnosi</h3>
                <ul>
                    <li><a href="#">Gore-dolje</a></li>
                    <li><a href="#">Lijevo-desno</a></li>
                    <li><a href="#">Ispred-iza</a></li>
                </ul>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
