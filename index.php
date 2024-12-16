<?php
/**
 * The main template file
 */
get_header();
?>

<main>
    <?php 
    if (have_posts()) :
        while (have_posts()) : the_post();
            // Main content loop
            the_content();
        endwhile;
    else :
        echo '<p>No content found</p>';
    endif;
    ?>
</main>

<?php
get_footer();
?>
