<?php
/**
 * Template Name: O Nama
 */

get_header(); ?>

<main>
    <section class="about-content">
        <h1><?php the_title(); ?></h1>
        <div class="about-grid">
            <div class="about-card mission">
                <h3>Naša misija</h3>
                <p>MatematikaPRO je obrazovna platforma posvećena pružanju kvalitetnog matematičkog obrazovanja svim učenicima. Naš cilj je učiniti matematiku pristupačnom, zanimljivom i razumljivom.</p>
            </div>
            <div class="about-card approach">
                <h3>Naš pristup</h3>
                <p>Kombiniramo moderne tehnologije i dokazane pedagoške metode kako bismo stvorili personalizirano iskustvo učenja. Svaki učenik napreduje svojim tempom kroz pažljivo osmišljene materijale.</p>
            </div>
            <div class="about-card team">
                <h3>Naš tim</h3>
                <p>Iza MatematikaPRO stoji tim iskusnih nastavnika matematike i stručnjaka za e-učenje koji kontinuirano rade na unapređenju sadržaja i metoda podučavanja.</p>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
