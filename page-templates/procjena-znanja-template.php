<?php
/**
 * Template Name: Procjena Znanja
 */

get_header(); ?>

<main>
    <section class="assessment-content">
        <h1><?php the_title(); ?></h1>
        <div class="assessment-grid">
            <div class="assessment-card">
                <h3>Inicijalna procjena</h3>
                <p>Započnite s inicijalnom procjenom kako bismo odredili vašu trenutnu razinu znanja i preporučili odgovarajući sadržaj za učenje.</p>
                <a href="<?php echo home_url('/inicijalna-procjena/'); ?>" class="btn-primary">Započni procjenu</a>
            </div>
            <div class="assessment-card">
                <h3>Tematske provjere</h3>
                <p>Provjerite svoje znanje iz specifičnih matematičkih tema i područja.</p>
                <a href="#" class="btn-primary">Odaberi temu</a>
            </div>
            <div class="assessment-card">
                <h3>Završne provjere</h3>
                <p>Testirajte svoje cjelokupno znanje na kraju obrazovnog razdoblja.</p>
                <a href="#" class="btn-primary">Započni provjeru</a>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
