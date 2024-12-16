<?php
get_header();
?>

<div class="archive-geometric-shapes">
    <h1>Naše Geometrijske Igre</h1>
    
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) : the_post();
    ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('game-item'); ?>>
            <header>
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            </header>
            
            <?php if ( has_post_thumbnail() ) : ?>
                <div class="game-thumbnail">
                    <?php the_post_thumbnail('medium'); ?>
                </div>
            <?php endif; ?>
            
            <div class="game-excerpt">
                <?php the_excerpt(); ?>
            </div>
            
            <?php 
            $difficulty = get_post_meta( get_the_ID(), '_game_difficulty', true );
            ?>
            
            <div class="game-meta">
                <span class="difficulty">Težina: <?php echo esc_html( $difficulty ); ?></span>
                <a href="<?php the_permalink(); ?>" class="read-more">Više detalja</a>
            </div>
        </article>
    <?php
        endwhile;
        
        the_posts_pagination( array(
            'mid_size'  => 2,
            'prev_text' => __( 'Prethodne', 'matematika-tema' ),
            'next_text' => __( 'Sljedeće', 'matematika-tema' ),
        ) );
        
    else :
        echo '<p>Trenutno nema dostupnih geometrijskih igara.</p>';
    endif;
    ?>
</div>

<?php
get_footer();
?>
