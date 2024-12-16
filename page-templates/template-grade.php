<?php
/**
 * Template Name: Predložak razreda
 */

get_header(); ?>

<main>
    <section class="grade-content">
        <h1><?php the_title(); ?></h1>
        <?php if ($description = get_field('grade_description')): ?>
            <div class="grade-description">
                <?php echo wp_kses_post($description); ?>
            </div>
        <?php endif; ?>
        
        <div class="topics-grid">
            <?php
            // Petlja za 3 teme
            for ($topic_num = 1; $topic_num <= 3; $topic_num++):
                $topic_title = get_field("topic{$topic_num}_title");
                if ($topic_title):
            ?>
                <div class="topic-card">
                    <h3><?php echo esc_html($topic_title); ?></h3>
                    <ul>
                        <?php
                        // Petlja za 4 stavke po temi
                        for ($item_num = 1; $item_num <= 4; $item_num++):
                            $item_title = get_field("topic{$topic_num}_item{$item_num}_title");
                            $item_link = get_field("topic{$topic_num}_item{$item_num}_link");
                            
                            if ($item_title):
                                $link = $item_link ? $item_link : '#';
                        ?>
                            <li>
                                <a href="<?php echo esc_url($link); ?>">
                                    <?php echo esc_html($item_title); ?>
                                </a>
                            </li>
                        <?php 
                            endif;
                        endfor; 
                        ?>
                    </ul>
                </div>
            <?php 
                endif;
            endfor; 
            ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>
