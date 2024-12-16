<?php
get_header();

while ( have_posts() ) : the_post();
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <header class="entry-header">
        <h1 class="entry-title"><?php the_title(); ?></h1>
    </header>

    <div class="entry-content">
        <?php the_content(); ?>
        
        <?php 
        $difficulty = get_post_meta( get_the_ID(), '_game_difficulty', true );
        $duration = get_post_meta( get_the_ID(), '_game_duration', true );
        ?>
        
        <div class="game-details">
            <h3>Detalji Igre</h3>
            <p>Težina: <?php echo esc_html( $difficulty ); ?></p>
            <p>Preporučeno trajanje: <?php echo esc_html( $duration ); ?> minuta</p>
        </div>
        
        <a href="<?php echo esc_url( get_permalink( get_page_by_path( 'geometric-shapes-game' ) ) ); ?>" class="play-game-button">
            Započni Igru
        </a>
    </div>
</article>

<?php
endwhile;

get_footer();
?>
