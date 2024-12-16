<?php
/**
 * Template Name: Početna stranica
 */

get_header(); ?>

<main class="home-content">
    <section class="grade-grid">
        <?php
        // Array of grade pages with exact slugs and URLs
        $grades = array(
            array(
                'slug' => 'predskolski',
                'display_name' => 'Predškolski program',
                'url' => home_url('/predskolski/')
            ),
            array(
                'slug' => '1-razred',
                'display_name' => '1. Razred',
                'url' => home_url('/1-razred/')
            ),
            array(
                'slug' => '2-razred',
                'display_name' => '2. Razred',
                'url' => home_url('/2-razred/')
            ),
            array(
                'slug' => '3-razred',
                'display_name' => '3. Razred',
                'url' => home_url('/3-razred/')
            ),
            array(
                'slug' => '4-razred',
                'display_name' => '4. Razred',
                'url' => home_url('/4-razred/')
            ),
            array(
                'slug' => '5-razred',
                'display_name' => '5. Razred',
                'url' => home_url('/5-razred/')
            ),
            array(
                'slug' => '6-razred',
                'display_name' => '6. Razred',
                'url' => home_url('/6-razred/')
            ),
            array(
                'slug' => '7-razred',
                'display_name' => '7. Razred',
                'url' => home_url('/7-razred/')
            ),
            array(
                'slug' => '8-razred',
                'display_name' => '8. Razred',
                'url' => home_url('/8-razred/')
            )
        );

        foreach ($grades as $grade) {
            // Get page by slug
            $page = get_page_by_path($grade['slug']);
            
            if ($page) {
                $description = get_field('grade_description', $page->ID);
                $description_excerpt = wp_trim_words($description, 20, '...');
                ?>
                <div class="grade-card">
                    <h2><?php echo esc_html($grade['display_name']); ?></h2>
                    <?php if ($description_excerpt): ?>
                        <p class="grade-excerpt"><?php echo esc_html($description_excerpt); ?></p>
                    <?php endif; ?>
                    <a href="<?php echo esc_url($grade['url']); ?>" class="grade-link">
                        Pogledaj sadržaj
                        <span class="arrow">→</span>
                    </a>
                </div>
                <?php
            }
        }
        ?>
    </section>
</main>

<?php get_footer(); ?>
