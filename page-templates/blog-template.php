<?php
/*
Template Name: Blog Template
*/
get_header();
?>

<div class="blog-container">
    <div class="blog-header">
        <h1><?php the_title(); ?></h1>
    </div>

    <div class="blog-content">
        <?php
        // Blog query
        $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
        $blog_query = new WP_Query(array(
            'post_type' => 'post',
            'posts_per_page' => 10,
            'paged' => $paged
        ));

        if ($blog_query->have_posts()) :
            while ($blog_query->have_posts()) : $blog_query->the_post();
        ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('blog-post'); ?>>
                <header class="entry-header">
                    <h2 class="entry-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                    <div class="entry-meta">
                        <span class="posted-on">
                            <?php echo get_the_date(); ?>
                        </span>
                        <span class="byline">
                            <?php the_author_posts_link(); ?>
                        </span>
                    </div>
                </header>

                <div class="entry-content">
                    <?php the_excerpt(); ?>
                    <a href="<?php the_permalink(); ?>" class="read-more">Read More</a>
                </div>
            </article>
        <?php 
            endwhile;

            // Pagination
            echo '<div class="pagination">';
            echo paginate_links(array(
                'total' => $blog_query->max_num_pages
            ));
            echo '</div>';

            wp_reset_postdata();
        else :
            echo '<p>No posts found.</p>';
        endif;
        ?>
    </div>
</div>

<?php get_footer(); ?>
