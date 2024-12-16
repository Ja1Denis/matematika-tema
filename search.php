<?php
/**
 * The template for displaying search results
 */

get_header(); ?>

<div class="search-results-container">
    <div class="search-header">
        <h1 class="page-title">
            <?php
            printf(
                'Rezultati pretrage za: %s',
                '<span>' . get_search_query() . '</span>'
            );
            ?>
        </h1>
    </div>

    <div class="search-results">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('search-result-item'); ?>>
                    <header class="entry-header">
                        <h2 class="entry-title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                    </header>

                    <div class="entry-summary">
                        <?php 
                        // Prikazujemo excerpt ili dio sadržaja
                        if (has_excerpt()) {
                            echo wp_trim_words(get_the_excerpt(), 30);
                        } else {
                            echo wp_trim_words(get_the_content(), 30);
                        }
                        ?>
                    </div>

                    <footer class="entry-footer">
                        <a href="<?php the_permalink(); ?>" class="read-more">Pročitaj više</a>
                    </footer>
                </article>
            <?php endwhile; ?>

            <?php
            // Paginacija
            the_posts_pagination(array(
                'mid_size' => 2,
                'prev_text' => '&laquo; Prethodna',
                'next_text' => 'Sljedeća &raquo;'
            ));
            ?>

        <?php else : ?>
            <div class="no-results">
                <h2>Nema rezultata</h2>
                <p>Nažalost, nismo pronašli ništa što odgovara vašem upitu. Pokušajte s drugim ključnim riječima.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>
