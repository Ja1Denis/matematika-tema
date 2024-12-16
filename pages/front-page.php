<?php
/**
 * The template for displaying the front page
 */

get_header(); ?>

<main id="primary" class="site-main">
    <div class="hero-section bg-primary text-white py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <h1 class="display-4"><?php echo get_bloginfo('name'); ?></h1>
                    <p class="lead"><?php echo get_bloginfo('description'); ?></p>
                    <a href="#featured-content" class="btn btn-light btn-lg">Započni učenje</a>
                </div>
                <div class="col-md-6">
                    <!-- Hero image can be added here -->
                </div>
            </div>
        </div>
    </div>

    <div id="featured-content" class="container py-5">
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="card-title">Matematika</h3>
                        <p class="card-text">Istražite svijet matematike kroz interaktivne lekcije i vježbe.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="card-title">Vježbe</h3>
                        <p class="card-text">Praktični zadaci i vježbe za utvrđivanje znanja.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="card-title">Resursi</h3>
                        <p class="card-text">Dodatni materijali i resursi za učenje.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <div class="container py-4">
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </div>
    <?php endwhile; endif; ?>
</main>

<?php get_footer(); ?>
