<?php
/**
 * The template for displaying 404 pages (not found)
 */

get_header(); ?>

<main id="primary" class="site-main">
    <div class="container py-5">
        <div class="row justify-content-center text-center">
            <div class="col-md-8">
                <h1 class="display-1">404</h1>
                <h2 class="mb-4">Stranica nije pronađena</h2>
                <p class="lead mb-4">Nažalost, stranica koju tražite ne postoji ili je premještena.</p>
                <div class="mb-4">
                    <?php get_search_form(); ?>
                </div>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary">Povratak na početnu</a>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
