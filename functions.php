<?php
/**
 * Theme functions and definitions
 */

// Include authentication related functions
require_once get_template_directory() . '/inc/register-functions.php';
require_once get_template_directory() . '/inc/login-functions.php';
require_once get_template_directory() . '/inc/password-recovery-functions.php';

// Uključi funkcije za povezivanje slika i riječi
// require_once get_template_directory() . '/inc/povezivanje-functions.php';

function matematika_tema_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');

    // Register navigation menus
    register_nav_menus(array(
        'primary-menu' => __('Primary Menu', 'matematika-tema'),
    ));
}
add_action('after_setup_theme', 'matematika_tema_setup');

// Add rewrite rules for grade pages
function matematika_add_rewrite_rules() {
    add_rewrite_rule(
        '^([1-8])-razred/?$',
        'index.php?pagename=$matches[1]-razred',
        'top'
    );
    add_rewrite_rule(
        '^predskolski/?$',
        'index.php?pagename=predskolski',
        'top'
    );
    flush_rewrite_rules();
}
add_action('init', 'matematika_add_rewrite_rules');

// Filter navigation menu items to fix grade page URLs
function matematika_fix_nav_menu_items($items) {
    foreach ($items as $item) {
        // Check if this is a grade page link
        if (preg_match('/razred-([1-8])$/', $item->url, $matches)) {
            // Replace with correct URL format
            $item->url = home_url('/' . $matches[1] . '-razred/');
        }
        // Check for predskolski page
        if (strpos($item->url, 'razred-predskolski') !== false) {
            $item->url = home_url('/predskolski/');
        }
    }
    return $items;
}
add_filter('wp_nav_menu_objects', 'matematika_fix_nav_menu_items');

function matematika_tema_scripts() {
    // Enqueue styles
    wp_enqueue_style('matematika-tema-style', get_stylesheet_uri());
    wp_enqueue_style('matematika-tema-grade-template', get_template_directory_uri() . '/css/grade-template.css');
    wp_enqueue_style('matematika-tema-home-template', get_template_directory_uri() . '/css/home-template.css');
    wp_enqueue_style('matematika-main-style', get_template_directory_uri() . '/css/style.css');
    wp_enqueue_style('matematika-responsive', get_template_directory_uri() . '/css/responsive.css');
    wp_enqueue_style('matematika-animations', get_template_directory_uri() . '/css/animations.css');
    wp_enqueue_style('matematika-navigation', get_template_directory_uri() . '/css/navigation.css');
    wp_enqueue_style('matematika-pages', get_template_directory_uri() . '/css/pages.css');
    wp_enqueue_style('matematika-concepts', get_template_directory_uri() . '/css/concepts.css');
    wp_enqueue_style('interactive-addition-style', get_template_directory_uri() . '/css/interactive-addition.css');

    // Enqueue scripts
    wp_enqueue_script('matematika-main-js', get_template_directory_uri() . '/js/main.js', array(), '', true);
    wp_enqueue_script('matematika-navigation-js', get_template_directory_uri() . '/js/navigation.js', array(), '', true);
    wp_enqueue_script('interactive-addition-js', get_template_directory_uri() . '/js/interactive-addition.js', array(), '', true);
    wp_enqueue_script('interactive-subtraction-js', get_template_directory_uri() . '/js/interactive-subtraction.js', array(), '', true);
}
add_action('wp_enqueue_scripts', 'matematika_tema_scripts');

/**
 * Enqueue grade template styles
 */
function matematika_enqueue_grade_styles() {
    if (is_page_template('page-templates/template-grade.php')) {
        wp_enqueue_style('matematika-grade-template', get_template_directory_uri() . '/css/grade-template.css', array(), '1.0.0');
    }
}
add_action('wp_enqueue_scripts', 'matematika_enqueue_grade_styles');

/**
 * Handle progress saving via AJAX
 */
function matematika_save_progress() {
    // Verify nonce for security
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'save_progress_nonce')) {
        wp_send_json_error('Invalid nonce');
        return;
    }

    // Check if user is logged in
    if (!is_user_logged_in()) {
        wp_send_json_error('User not logged in');
        return;
    }

    $topic_id = sanitize_text_field($_POST['topic_id']);
    $item_id = sanitize_text_field($_POST['item_id']);
    $completed = $_POST['completed'] === 'true';
    $user_id = get_current_user_id();

    // Get current completed items
    $completed_items = get_user_meta($user_id, 'completed_' . $topic_id, true);
    if (!is_array($completed_items)) {
        $completed_items = array();
    }

    // Update completed items
    if ($completed && !in_array($item_id, $completed_items)) {
        $completed_items[] = $item_id;
    } elseif (!$completed && in_array($item_id, $completed_items)) {
        $completed_items = array_diff($completed_items, array($item_id));
    }

    // Save updated progress
    update_user_meta($user_id, 'completed_' . $topic_id, array_values($completed_items));

    // Calculate total progress
    $total_progress = matematika_calculate_total_progress($user_id);

    wp_send_json_success(array(
        'completed_items' => $completed_items,
        'total_progress' => $total_progress
    ));
}
add_action('wp_ajax_save_progress', 'matematika_save_progress');

/**
 * Calculate total progress across all topics
 */
function matematika_calculate_total_progress($user_id) {
    $total_items = 0;
    $total_completed = 0;

    // Get all topics
    $topics = get_posts(array(
        'post_type' => 'page',
        'meta_query' => array(
            array(
                'key' => '_wp_page_template',
                'value' => 'page-templates/template-grade.php'
            )
        )
    ));

    foreach ($topics as $topic) {
        if (have_rows('topics', $topic->ID)) {
            while (have_rows('topics', $topic->ID)) {
                the_row();
                $topic_id = sanitize_title(get_sub_field('topic_title'));
                
                if (have_rows('topic_items')) {
                    while (have_rows('topic_items')) {
                        the_row();
                        $total_items++;
                    }
                }

                $completed_items = get_user_meta($user_id, 'completed_' . $topic_id, true);
                if (is_array($completed_items)) {
                    $total_completed += count($completed_items);
                }
            }
        }
    }

    return array(
        'total' => $total_items,
        'completed' => $total_completed,
        'percentage' => $total_items > 0 ? round(($total_completed / $total_items) * 100) : 0
    );
}

/**
 * Add progress data to user profile
 */
function matematika_add_user_progress_fields($user) {
    $progress = matematika_calculate_total_progress($user->ID);
    ?>
    <h3>Napredak u učenju</h3>
    <table class="form-table">
        <tr>
            <th><label>Ukupni napredak</label></th>
            <td>
                <div class="progress-info">
                    <p><?php echo $progress['completed']; ?> od <?php echo $progress['total']; ?> zadataka završeno (<?php echo $progress['percentage']; ?>%)</p>
                </div>
            </td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'matematika_add_user_progress_fields');
add_action('edit_user_profile', 'matematika_add_user_progress_fields');

// Register ACF Fields for Grade Templates
function matematika_register_acf_fields() {
    if (function_exists('acf_add_local_field_group')):

        acf_add_local_field_group(array(
            'key' => 'group_grade_template',
            'title' => 'Grade Template Fields',
            'fields' => array(
                array(
                    'key' => 'field_grade_description',
                    'label' => 'Grade Description',
                    'name' => 'grade_description',
                    'type' => 'textarea',
                ),
                // Topic 1
                array(
                    'key' => 'field_topic1_title',
                    'label' => 'Topic 1 Title',
                    'name' => 'topic1_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic1_item1_title',
                    'label' => 'Topic 1 Item 1 Title',
                    'name' => 'topic1_item1_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic1_item1_link',
                    'label' => 'Topic 1 Item 1 Link',
                    'name' => 'topic1_item1_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic1_item2_title',
                    'label' => 'Topic 1 Item 2 Title',
                    'name' => 'topic1_item2_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic1_item2_link',
                    'label' => 'Topic 1 Item 2 Link',
                    'name' => 'topic1_item2_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic1_item3_title',
                    'label' => 'Topic 1 Item 3 Title',
                    'name' => 'topic1_item3_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic1_item3_link',
                    'label' => 'Topic 1 Item 3 Link',
                    'name' => 'topic1_item3_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic1_item4_title',
                    'label' => 'Topic 1 Item 4 Title',
                    'name' => 'topic1_item4_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic1_item4_link',
                    'label' => 'Topic 1 Item 4 Link',
                    'name' => 'topic1_item4_link',
                    'type' => 'url',
                ),
                // Topic 2
                array(
                    'key' => 'field_topic2_title',
                    'label' => 'Topic 2 Title',
                    'name' => 'topic2_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic2_item1_title',
                    'label' => 'Topic 2 Item 1 Title',
                    'name' => 'topic2_item1_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic2_item1_link',
                    'label' => 'Topic 2 Item 1 Link',
                    'name' => 'topic2_item1_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic2_item2_title',
                    'label' => 'Topic 2 Item 2 Title',
                    'name' => 'topic2_item2_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic2_item2_link',
                    'label' => 'Topic 2 Item 2 Link',
                    'name' => 'topic2_item2_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic2_item3_title',
                    'label' => 'Topic 2 Item 3 Title',
                    'name' => 'topic2_item3_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic2_item3_link',
                    'label' => 'Topic 2 Item 3 Link',
                    'name' => 'topic2_item3_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic2_item4_title',
                    'label' => 'Topic 2 Item 4 Title',
                    'name' => 'topic2_item4_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic2_item4_link',
                    'label' => 'Topic 2 Item 4 Link',
                    'name' => 'topic2_item4_link',
                    'type' => 'url',
                ),
                // Topic 3
                array(
                    'key' => 'field_topic3_title',
                    'label' => 'Topic 3 Title',
                    'name' => 'topic3_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic3_item1_title',
                    'label' => 'Topic 3 Item 1 Title',
                    'name' => 'topic3_item1_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic3_item1_link',
                    'label' => 'Topic 3 Item 1 Link',
                    'name' => 'topic3_item1_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic3_item2_title',
                    'label' => 'Topic 3 Item 2 Title',
                    'name' => 'topic3_item2_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic3_item2_link',
                    'label' => 'Topic 3 Item 2 Link',
                    'name' => 'topic3_item2_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic3_item3_title',
                    'label' => 'Topic 3 Item 3 Title',
                    'name' => 'topic3_item3_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic3_item3_link',
                    'label' => 'Topic 3 Item 3 Link',
                    'name' => 'topic3_item3_link',
                    'type' => 'url',
                ),
                array(
                    'key' => 'field_topic3_item4_title',
                    'label' => 'Topic 3 Item 4 Title',
                    'name' => 'topic3_item4_title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_topic3_item4_link',
                    'label' => 'Topic 3 Item 4 Link',
                    'name' => 'topic3_item4_link',
                    'type' => 'url',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page_template',
                        'operator' => '==',
                        'value' => 'page-templates/template-grade.php',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
        ));

    endif;
}
add_action('acf/init', 'matematika_register_acf_fields');

// Register ACF Fields for Assessment Template
function matematika_register_assessment_fields() {
    if(function_exists('acf_add_local_field_group')):

        acf_add_local_field_group(array(
            'key' => 'group_assessment_template',
            'title' => 'Procjena znanja postavke',
            'fields' => array(
                array(
                    'key' => 'field_initial_assessment',
                    'label' => 'Inicijalna procjena',
                    'name' => 'initial_assessment',
                    'type' => 'group',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_initial_title',
                            'label' => 'Naslov',
                            'name' => 'title',
                            'type' => 'text',
                            'default_value' => 'Inicijalna procjena',
                        ),
                        array(
                            'key' => 'field_initial_description',
                            'label' => 'Opis',
                            'name' => 'description',
                            'type' => 'textarea',
                            'default_value' => 'Započnite s inicijalnom procjenom kako bismo odredili vašu trenutnu razinu znanja i preporučili odgovarajući sadržaj za učenje.',
                        ),
                        array(
                            'key' => 'field_initial_button_text',
                            'label' => 'Tekst gumba',
                            'name' => 'button_text',
                            'type' => 'text',
                            'default_value' => 'Započni procjenu',
                        ),
                        array(
                            'key' => 'field_initial_button_link',
                            'label' => 'Link gumba',
                            'name' => 'button_link',
                            'type' => 'url',
                            'default_value' => '#',
                        ),
                    ),
                ),
                array(
                    'key' => 'field_thematic_assessment',
                    'label' => 'Tematske provjere',
                    'name' => 'thematic_assessment',
                    'type' => 'group',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_thematic_title',
                            'label' => 'Naslov',
                            'name' => 'title',
                            'type' => 'text',
                            'default_value' => 'Tematske provjere',
                        ),
                        array(
                            'key' => 'field_thematic_description',
                            'label' => 'Opis',
                            'name' => 'description',
                            'type' => 'textarea',
                            'default_value' => 'Provjerite svoje znanje iz specifičnih matematičkih tema i područja.',
                        ),
                        array(
                            'key' => 'field_thematic_button_text',
                            'label' => 'Tekst gumba',
                            'name' => 'button_text',
                            'type' => 'text',
                            'default_value' => 'Odaberi temu',
                        ),
                        array(
                            'key' => 'field_thematic_button_link',
                            'label' => 'Link gumba',
                            'name' => 'button_link',
                            'type' => 'url',
                            'default_value' => '#',
                        ),
                    ),
                ),
                array(
                    'key' => 'field_final_assessment',
                    'label' => 'Završne provjere',
                    'name' => 'final_assessment',
                    'type' => 'group',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_final_title',
                            'label' => 'Naslov',
                            'name' => 'title',
                            'type' => 'text',
                            'default_value' => 'Završne provjere',
                        ),
                        array(
                            'key' => 'field_final_description',
                            'label' => 'Opis',
                            'name' => 'description',
                            'type' => 'textarea',
                            'default_value' => 'Testirajte svoje cjelokupno znanje na kraju obrazovnog razdoblja.',
                        ),
                        array(
                            'key' => 'field_final_button_text',
                            'label' => 'Tekst gumba',
                            'name' => 'button_text',
                            'type' => 'text',
                            'default_value' => 'Započni provjeru',
                        ),
                        array(
                            'key' => 'field_final_button_link',
                            'label' => 'Link gumba',
                            'name' => 'button_link',
                            'type' => 'url',
                            'default_value' => '#',
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page_template',
                        'operator' => '==',
                        'value' => 'page-templates/procjena-znanja-template.php',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
        ));

    endif;
}
add_action('acf/init', 'matematika_register_assessment_fields');

/**
 * Register page templates
 */
function register_page_templates($templates) {
    $templates['page-templates/template-grade.php'] = 'Grade Template';
    $templates['page-templates/template-assessment.php'] = 'Assessment Template';
    $templates['page-templates/template-crtanje-linije.php'] = 'Crtanje Linije Template';
    $templates['page-templates/template-oduzimanje.php'] = 'Oduzimanje Template';
    $templates['page-templates/povezi-sliku-i-rijec.php'] = 'Poveži sliku i riječ';
    return $templates;
}
add_filter('theme_page_templates', 'register_page_templates');

// Add Blog Support
function matematika_tema_blog_setup() {
    // Enable featured images for posts
    add_theme_support('post-thumbnails');

    // Register blog-related image sizes
    add_image_size('blog-thumbnail', 800, 400, true);
    add_image_size('blog-featured', 1200, 600, true);
}
add_action('after_setup_theme', 'matematika_tema_blog_setup');

// Custom excerpt length
function matematika_tema_custom_excerpt_length($length) {
    return 30; // Number of words
}
add_filter('excerpt_length', 'matematika_tema_custom_excerpt_length');

// Custom excerpt more link
function matematika_tema_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'matematika_tema_excerpt_more');

// Register blog sidebar
function matematika_tema_blog_widgets_init() {
    register_sidebar(array(
        'name'          => 'Blog Sidebar',
        'id'            => 'blog_sidebar',
        'description'   => 'Widgets in this area will be shown on blog posts and archive pages.',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'matematika_tema_blog_widgets_init');

// Registracija skripti i stilova za igru uspoređivanja brojeva
function register_number_comparison_game_assets() {
    if (is_page_template('page-templates/usporedi-brojeve.php')) {
        wp_enqueue_style('usporedi-brojeve-style', get_template_directory_uri() . '/css/number-comparison-game.css', array(), '1.0.0');
        wp_enqueue_script('usporedi-brojeve-script', get_template_directory_uri() . '/js/number-comparison-game.js', array(), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'register_number_comparison_game_assets');

// Registracija skripti i stilova za matematičke zadatke
function register_matematicki_zadaci_assets() {
    if (is_page_template('page-templates/matematicki-zadaci.php')) {
        wp_enqueue_style(
            'matematicki-zadaci-style',
            get_template_directory_uri() . '/assets/css/matematicki-zadaci.css',
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'matematicki-zadaci-script',
            get_template_directory_uri() . '/assets/js/matematicki-zadaci.js',
            array('jquery'),
            '1.0.0',
            true
        );

        // Dodaj FontAwesome ako već nije učitan
        wp_enqueue_style(
            'font-awesome',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
            array(),
            '5.15.4'
        );

        // Dodaj Bootstrap ako već nije učitan
        wp_enqueue_style(
            'bootstrap',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
            array(),
            '5.1.3'
        );

        wp_enqueue_script(
            'bootstrap-bundle',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
            array('jquery'),
            '5.1.3',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'register_matematicki_zadaci_assets');

// Registracija skripti i stilova za matematičku igru
function register_matematicka_igra_assets() {
    // Provjeri je li trenutna stranica koristi predložak matematičke igre
    if (!is_page_template('page-templates/matematicka-igra.php')) {
        return;
    }

    wp_enqueue_style(
        'matematicka-igra-style',
        get_template_directory_uri() . '/css/matematicka-igra.css',
        array(),
        '1.0.0'
    );

    // Registracija JavaScript-a
    wp_enqueue_script(
        'matematicka-igra-script',
        get_template_directory_uri() . '/js/matematicka-igra.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // Lokalizacija skripte - dodavanje WordPress URL-a i nonce-a
    wp_localize_script(
        'matematicka-igra-script',
        'matematickaIgraObj',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('matematicka_igra_nonce')
        )
    );
}
add_action('wp_enqueue_scripts', 'register_matematicka_igra_assets');

// Dodaj predložak stranice za crtanje ravnih linija
function register_crtanje_linije_template($templates) {
    error_log('Registering crtanje linije template');
    $templates['page-templates/page-crtanje-linije.php'] = 'Crtanje Ravne Linije';
    return $templates;
}
add_filter('theme_page_templates', 'register_crtanje_linije_template');

// Registracija skripti i stilova za crtanje ravnih linija
function register_crtanje_linije_assets() {
    global $post;
    
    // Debug
    error_log('Checking crtanje linije assets...');
    error_log('Post ID: ' . (isset($post->ID) ? $post->ID : 'No post'));
    error_log('Post Type: ' . (isset($post->post_type) ? $post->post_type : 'No post type'));
    error_log('Template: ' . get_page_template_slug());
    
    // Provjeri je li stranica koristi naš predložak
    if (is_page() && get_page_template_slug() === 'page-templates/page-crtanje-linije.php') {
        error_log('Loading crtanje linije assets');
        
        // Registriraj Google Font
        wp_enqueue_style('comic-neue-font', 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        
        // Registriraj CSS
        wp_enqueue_style('crtanje-linije-style', 
            get_template_directory_uri() . '/css/crtanje-linije.css',
            array(),
            time()  // Dodaj timestamp za development
        );
        
        // Registriraj jQuery
        wp_enqueue_script('jquery');
        
        // Registriraj JavaScript
        wp_enqueue_script('crtanje-linije-script',
            get_template_directory_uri() . '/js/crtanje-linije.js',
            array('jquery'),
            time(),
            true
        );

        // Dodaj inline skriptu za provjeru učitavanja
        wp_add_inline_script('crtanje-linije-script', 'console.log("Crtanje linije script loaded");', 'before');
    } else {
        error_log('Not using crtanje linije template, skipping asset loading');
    }
}
add_action('wp_enqueue_scripts', 'register_crtanje_linije_assets', 100);

// Registracija skripti i stilova za oduzimanje do 20
function register_oduzimanje_do_20_assets() {
    if (is_page_template('page-templates/template-oduzimanje.php')) {
        // Registriramo i enqueue-amo CSS
        wp_enqueue_style(
            'oduzimanje-style',
            get_template_directory_uri() . '/Brojevi-do-20/oduzimanjeDo20/style.css',
            array(),
            '1.0.0'
        );

        // Registriramo i enqueue-amo JavaScript
        wp_enqueue_script(
            'oduzimanje-script',
            get_template_directory_uri() . '/Brojevi-do-20/oduzimanjeDo20/script.js',
            array('jquery'),
            '1.0.0',
            true
        );

        // Dodajemo WordPress AJAX URL i nonce za sigurnost
        wp_localize_script(
            'oduzimanje-script',
            'mathAppData',
            array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('math_app_nonce'),
                'user_id' => get_current_user_id()
            )
        );
    }
}
add_action('wp_enqueue_scripts', 'register_oduzimanje_do_20_assets');

// AJAX endpoint za spremanje rezultata oduzimanja
function save_oduzimanje_result() {
    check_ajax_referer('math_app_nonce', 'nonce');

    $user_id = get_current_user_id();
    if (!$user_id) {
        wp_send_json_error('User not logged in');
        return;
    }

    $score = isset($_POST['score']) ? intval($_POST['score']) : 0;
    $time_spent = isset($_POST['time_spent']) ? intval($_POST['time_spent']) : 0;

    // Spremamo rezultat kao user meta
    $results = get_user_meta($user_id, 'oduzimanje_results', true);
    if (!is_array($results)) {
        $results = array();
    }

    $results[] = array(
        'score' => $score,
        'time_spent' => $time_spent,
        'date' => current_time('mysql')
    );

    update_user_meta($user_id, 'oduzimanje_results', $results);
    wp_send_json_success('Result saved');
}
add_action('wp_ajax_save_oduzimanje_result', 'save_oduzimanje_result');

// Enqueue scripts and styles for Oduzimanje do 20
function enqueue_oduzimanje_assets() {
    if (is_page_template('page-templates/template-oduzimanje.php')) {
        wp_enqueue_style('comic-neue', 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        wp_enqueue_style('oduzimanje-style', get_template_directory_uri() . '/assets/css/oduzimanje.css', array(), '1.0.0');
        wp_enqueue_script('oduzimanje-script', get_template_directory_uri() . '/assets/js/oduzimanje.js', array('jquery'), '1.0.0', true);
        
        wp_localize_script('oduzimanje-script', 'ajaxurl', admin_url('admin-ajax.php'));
        wp_localize_script('oduzimanje-script', 'nonce', wp_create_nonce('save_oduzimanje_progress'));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_oduzimanje_assets');

// AJAX handler for saving oduzimanje progress
function save_oduzimanje_progress() {
    check_ajax_referer('save_oduzimanje_progress');
    
    if (!is_user_logged_in()) {
        wp_send_json_error('User not logged in');
        return;
    }
    
    $user_id = get_current_user_id();
    $score = intval($_POST['score']);
    $total = intval($_POST['total']);
    
    update_user_meta($user_id, 'oduzimanje_score', $score);
    update_user_meta($user_id, 'oduzimanje_total', $total);
    
    wp_send_json_success(array(
        'message' => 'Progress saved successfully',
        'score' => $score,
        'total' => $total
    ));
}
add_action('wp_ajax_save_oduzimanje_progress', 'save_oduzimanje_progress');
add_action('wp_ajax_nopriv_save_oduzimanje_progress', function() {
    wp_send_json_error('User not logged in');
});

// Funkcije za igru Poveži Sliku i Riječ
function get_game_data_callback() {
    check_ajax_referer('povezi-sliku-i-rijec-nonce', 'nonce');
    
    $mode = sanitize_text_field($_POST['mode']);
    $difficulty = sanitize_text_field($_POST['difficulty']);
    
    // Ovdje implementirati logiku za dohvaćanje podataka ovisno o modu i težini
    $pairs = array(
        array(
            'image' => get_theme_file_uri('assets/images/geometrijski-likovi/kvadrat.png'),
            'word' => 'Kvadrat'
        ),
        array(
            'image' => get_theme_file_uri('assets/images/geometrijski-likovi/trokut.png'),
            'word' => 'Trokut'
        ),
        array(
            'image' => get_theme_file_uri('assets/images/geometrijski-likovi/krug.png'),
            'word' => 'Krug'
        ),
        // Dodati više parova prema potrebi
    );
    
    wp_send_json_success($pairs);
}
add_action('wp_ajax_get_game_data', 'get_game_data_callback');
add_action('wp_ajax_nopriv_get_game_data', 'get_game_data_callback');

// Dodaj predložak stranice za povezivanje slika i riječi
function register_povezivanje_template($templates) {
    $templates['page-templates/povezi-sliku-i-rijec.php'] = 'Poveži sliku i riječ';
    return $templates;
}
add_filter('theme_page_templates', 'register_povezivanje_template');

// Učitavanje resursa za igru povezivanja
function enqueue_povezivanje_assets() {
    if (is_page_template('page-templates/povezi-sliku-i-rijec.php')) {
        wp_enqueue_style('comic-neue', 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        wp_enqueue_style('povezi-sliku-i-rijec-style', get_template_directory_uri() . '/assets/css/povezi-sliku-i-rijec.css');
        wp_enqueue_script('povezi-sliku-i-rijec-script', get_template_directory_uri() . '/assets/js/povezi-sliku-i-rijec.js', array('jquery'), '1.0', true);
        
        wp_localize_script('povezi-sliku-i-rijec-script', 'poveziSlikuIRijecData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('povezi-sliku-i-rijec-nonce'),
            'themeUrl' => get_template_directory_uri()
        ));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_povezivanje_assets');

// Povezivanje igra funkcije
// function enqueue_povezivanje_assets() {
//     if (is_page_template('page-templates/template-povezivanje.php')) {
//         wp_enqueue_style('comic-neue', 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
//         wp_enqueue_style('povezivanje-style', get_template_directory_uri() . '/assets/games/povezivanje/style.css', array(), '1.0.0');
//         wp_enqueue_script('povezivanje-script', get_template_directory_uri() . '/assets/games/povezivanje/script.js', array('jquery'), '1.0.0', true);
        
//         wp_localize_script('povezivanje-script', 'PovezivanjeGameData', array(
//             'ajaxurl' => admin_url('admin-ajax.php'),
//             'nonce' => wp_create_nonce('povezivanje_nonce')
//         ));
//     }
// }
// add_action('wp_enqueue_scripts', 'enqueue_povezivanje_assets');

// AJAX handler za spremanje rezultata
// function save_povezivanje_score() {
//     check_ajax_referer('povezivanje_nonce', '_ajax_nonce');
    
//     if (!is_user_logged_in()) {
//         wp_send_json_error('User not logged in');
//         return;
//     }
    
//     global $wpdb;
//     $table_name = $wpdb->prefix . 'povezivanje_scores';
    
//     $score = intval($_POST['score']);
//     $mode = sanitize_text_field($_POST['mode']);
//     $difficulty = sanitize_text_field($_POST['difficulty']);
//     $user_id = get_current_user_id();
    
//     $result = $wpdb->insert(
//         $table_name,
//         array(
//             'user_id' => $user_id,
//             'score' => $score,
//             'mode' => $mode,
//             'difficulty' => $difficulty,
//             'date_played' => current_time('mysql')
//         ),
//         array('%d', '%d', '%s', '%s', '%s')
//     );
    
//     if ($result) {
//         wp_send_json_success(array('message' => 'Score saved successfully'));
//     } else {
//         wp_send_json_error('Failed to save score');
//     }
// }
// add_action('wp_ajax_save_povezivanje_score', 'save_povezivanje_score');

// Kreiranje tablice za rezultate pri aktivaciji teme
// function create_povezivanje_scores_table() {
//     global $wpdb;
//     $table_name = $wpdb->prefix . 'povezivanje_scores';
    
//     $charset_collate = $wpdb->get_charset_collate();
    
//     $sql = "CREATE TABLE IF NOT EXISTS $table_name (
//         id bigint(20) NOT NULL AUTO_INCREMENT,
//         user_id bigint(20) NOT NULL,
//         score int(11) NOT NULL,
//         mode varchar(50) NOT NULL,
//         difficulty varchar(50) NOT NULL,
//         date_played datetime DEFAULT CURRENT_TIMESTAMP,
//         PRIMARY KEY  (id)
//     ) $charset_collate;";
    
//     require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
//     dbDelta($sql);
// }
// add_action('after_switch_theme', 'create_povezivanje_scores_table');

// Registracija resursa za tablicu množenja do 30
function register_tablica_mnozenja_30_assets() {
    if (is_page_template('page-templates/template-tablica-mnozenja-30.php')) {
        wp_enqueue_style('tablica-mnozenja-30-style', 
            get_template_directory_uri() . '/assets/css/tablica-mnozenja-30.css',
            array(),
            '1.0.0'
        );

        wp_enqueue_script('tablica-mnozenja-30-script',
            get_template_directory_uri() . '/assets/js/tablica-mnozenja-30.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'register_tablica_mnozenja_30_assets');

// Add mobile navigation JavaScript
function add_mobile_navigation_script() {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNavigation = document.querySelector('.main-navigation');

        if (mobileMenuToggle && mainNavigation) {
            mobileMenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                mainNavigation.classList.toggle('active');
            });

            // Zatvori meni kada se klikne izvan njega
            document.addEventListener('click', function(e) {
                if (!mainNavigation.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mainNavigation.classList.remove('active');
                }
            });

            // Zatvori meni kada se klikne na link
            const menuLinks = mainNavigation.getElementsByTagName('a');
            Array.from(menuLinks).forEach(link => {
                link.addEventListener('click', () => {
                    mainNavigation.classList.remove('active');
                });
            });
        }
    });
    </script>
    <?php
}
add_action('wp_footer', 'add_mobile_navigation_script');

// Prilagodba WordPress pretrage
function customize_search_query($query) {
    if (!is_admin() && $query->is_main_query() && $query->is_search()) {
        // Dodajemo sve custom post types u pretragu
        $post_types = get_post_types(array(
            'public' => true,
            'exclude_from_search' => false
        ), 'names');
        
        $query->set('post_type', array_values($post_types));
        
        // Postavljamo pretragu da traži po naslovu i sadržaju
        $search_term = $query->get('s');
        
        // Dodajemo pretragu po naslovu i sadržaju
        $query->set('_meta_or_title', $search_term);
        
        // Debugging
        error_log('Search term: ' . $search_term);
        error_log('Post types being searched: ' . print_r($post_types, true));
        
        // Proširujemo where dio upita
        add_filter('posts_where', function($where) use ($search_term) {
            global $wpdb;
            
            if ($search_term) {
                $where .= " OR {$wpdb->posts}.post_title LIKE '%" . esc_sql($search_term) . "%'";
                $where .= " OR {$wpdb->posts}.post_content LIKE '%" . esc_sql($search_term) . "%'";
                
                // Debugging
                error_log('Modified WHERE clause: ' . $where);
            }
            
            return $where;
        });
        
        // Postavljamo da se pretražuje i po dijelovima riječi
        $query->set('sentence', false);
        $query->set('exact', false);
        
        // Povećavamo broj rezultata
        $query->set('posts_per_page', 20);
    }
    return $query;
}
add_action('pre_get_posts', 'customize_search_query');

// Dodajemo podršku za pretragu po custom poljima
function custom_search_join($join) {
    global $wpdb;
    if (is_search()) {
        $join .= " LEFT JOIN {$wpdb->postmeta} ON {$wpdb->posts}.ID = {$wpdb->postmeta}.post_id ";
    }
    return $join;
}
add_filter('posts_join', 'custom_search_join');

// Modificiramo where dio upita za custom polja
function custom_search_where($where) {
    global $wpdb;
    if (is_search()) {
        $search_term = get_search_query();
        $where = preg_replace(
            "/\(\s*{$wpdb->posts}.post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
            "({$wpdb->posts}.post_title LIKE $1) OR ({$wpdb->postmeta}.meta_value LIKE $1)",
            $where
        );
        
        // Debugging
        error_log('Final WHERE clause: ' . $where);
    }
    return $where;
}
add_filter('posts_where', 'custom_search_where');

// Sprječavamo duplicirane rezultate
function custom_search_distinct() {
    if (is_search()) {
        return "DISTINCT";
    }
}
add_filter('posts_distinct', 'custom_search_distinct');

// Dodajemo AJAX endpoint za autocomplete
function register_search_autocomplete_endpoint() {
    add_action('wp_ajax_search_autocomplete', 'search_autocomplete_handler');
    add_action('wp_ajax_nopriv_search_autocomplete', 'search_autocomplete_handler');
}
add_action('init', 'register_search_autocomplete_endpoint');

// Handler za autocomplete zahtjeve
function search_autocomplete_handler() {
    // Sanitiziramo upit
    $search_term = sanitize_text_field($_GET['term']);
    
    if (empty($search_term)) {
        wp_send_json_error();
    }
    
    // Dohvaćamo rezultate
    $args = array(
        'post_type' => 'any',
        'post_status' => 'publish',
        'posts_per_page' => 5,
        's' => $search_term,
        'orderby' => 'relevance'
    );
    
    $query = new WP_Query($args);
    $suggestions = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $suggestions[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'url' => get_permalink(),
                'type' => get_post_type_object(get_post_type())->labels->singular_name
            );
        }
    }
    
    wp_reset_postdata();
    wp_send_json_success($suggestions);
}

// Dodajemo skriptu za autocomplete
function enqueue_search_autocomplete() {
    wp_enqueue_script('jquery-ui-autocomplete');
    wp_enqueue_script(
        'search-autocomplete',
        get_template_directory_uri() . '/js/search-autocomplete.js',
        array('jquery', 'jquery-ui-autocomplete'),
        '1.0',
        true
    );
    
    // Dodajemo potrebne podatke za JavaScript
    wp_localize_script('search-autocomplete', 'searchAutocomplete', array(
        'ajaxurl' => admin_url('admin-ajax.php')
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_search_autocomplete');

// Registracija Custom Post Type za Geometrijske Igre
function register_geometric_shapes_game_post_type() {
    $labels = array(
        'name'               => 'Geometrijske Igre',
        'singular_name'      => 'Geometrijska Igra',
        'menu_name'          => 'Geometrijske Igre',
        'add_new'            => 'Dodaj Novu',
        'add_new_item'       => 'Dodaj Novu Geometrijsku Igru',
        'edit_item'          => 'Uredi Igru',
        'new_item'           => 'Nova Igra',
        'view_item'          => 'Pogledaj Igru',
        'search_items'       => 'Pretraži Igre',
        'not_found'          => 'Nije pronađena nijedna igra',
        'not_found_in_trash' => 'Nije pronađena nijedna igra u trash-u'
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'geometrijske-igre' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => null,
        'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'custom-fields' )
    );

    register_post_type( 'geometric_shapes_game', $args );
}
add_action( 'init', 'register_geometric_shapes_game_post_type' );

// Dodavanje Custom Meta Polja za Igru
function add_game_meta_boxes() {
    add_meta_box(
        'game_details',
        'Detalji Igre',
        'render_game_meta_box',
        'geometric_shapes_game',
        'normal',
        'default'
    );
}
add_action( 'add_meta_boxes', 'add_game_meta_boxes' );

function render_game_meta_box( $post ) {
    wp_nonce_field( 'game_meta_box', 'game_meta_box_nonce' );
    
    $difficulty = get_post_meta( $post->ID, '_game_difficulty', true );
    $duration = get_post_meta( $post->ID, '_game_duration', true );
    
    ?>
    <label for="game_difficulty">Težina Igre:</label>
    <select name="game_difficulty" id="game_difficulty">
        <option value="lako" <?php selected( $difficulty, 'lako' ); ?>>Lako</option>
        <option value="srednje" <?php selected( $difficulty, 'srednje' ); ?>>Srednje</option>
        <option value="teško" <?php selected( $difficulty, 'teško' ); ?>>Teško</option>
    </select>
    
    <label for="game_duration">Trajanje Igre (min):</label>
    <input type="number" name="game_duration" id="game_duration" value="<?php echo esc_attr( $duration ); ?>" />
    <?php
}

function save_game_meta_box_data( $post_id ) {
    if ( ! isset( $_POST['game_meta_box_nonce'] ) ||
         ! wp_verify_nonce( $_POST['game_meta_box_nonce'], 'game_meta_box' ) ) {
        return;
    }

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    if ( isset( $_POST['game_difficulty'] ) ) {
        update_post_meta( $post_id, '_game_difficulty', sanitize_text_field( $_POST['game_difficulty'] ) );
    }

    if ( isset( $_POST['game_duration'] ) ) {
        update_post_meta( $post_id, '_game_duration', sanitize_text_field( $_POST['game_duration'] ) );
    }
}
add_action( 'save_post', 'save_game_meta_box_data' );

// Spremanje rezultata igre
function save_game_score() {
    // Provjera je li korisnik prijavljen
    if (!is_user_logged_in()) {
        wp_send_json_error('Morate biti prijavljeni');
        wp_die();
    }

    $username = sanitize_text_field($_POST['username']);
    $score = intval($_POST['score']);
    $current_user_id = get_current_user_id();

    // Spremanje rezultata kao custom post type
    $game_score_post = array(
        'post_title'    => 'Rezultat igre - ' . $username,
        'post_type'     => 'game_score',
        'post_status'   => 'publish'
    );

    $post_id = wp_insert_post($game_score_post);

    if ($post_id) {
        // Dodavanje meta podataka
        update_post_meta($post_id, '_game_username', $username);
        update_post_meta($post_id, '_game_user_id', $current_user_id);
        update_post_meta($post_id, '_game_score', $score);
        update_post_meta($post_id, '_game_type', 'geometric_shapes');
        update_post_meta($post_id, '_game_date', current_time('mysql'));

        wp_send_json_success('Rezultat spremljen');
    } else {
        wp_send_json_error('Greška kod spremanja');
    }

    wp_die();
}
add_action('wp_ajax_save_game_score', 'save_game_score');

// Registracija custom post type-a za rezultate igara
function register_game_score_post_type() {
    $labels = array(
        'name'               => 'Rezultati Igara',
        'singular_name'      => 'Rezultat Igre',
        'menu_name'          => 'Rezultati Igara',
        'add_new'            => 'Dodaj Novi',
        'add_new_item'       => 'Dodaj Novi Rezultat',
        'edit_item'          => 'Uredi Rezultat',
        'new_item'           => 'Novi Rezultat',
        'view_item'          => 'Pogledaj Rezultat',
        'search_items'       => 'Pretraži Rezultate',
        'not_found'          => 'Nije pronađen nijedan rezultat',
        'not_found_in_trash' => 'Nije pronađen nijedan rezultat u trash-u'
    );

    $args = array(
        'labels'             => $labels,
        'public'             => false,
        'publicly_queryable' => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => false,
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => null,
        'supports'           => array('title', 'custom-fields')
    );

    register_post_type('game_score', $args);
}
add_action('init', 'register_game_score_post_type');

// SEO optimizacija
function matematika_tema_add_seo_support() {
    // Dodaj podršku za custom image sizes za društvene mreže
    add_image_size('social-share', 1200, 630, true);
    
    // Dodaj podršku za schema.org markup
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'script',
        'style',
    ));
}
add_action('after_setup_theme', 'matematika_tema_add_seo_support');

// Optimizacija slika
function matematika_tema_lazy_loading_images($content) {
    return preg_replace('/<img(.*?)src=/i', '<img$1loading="lazy" src=', $content);
}
add_filter('the_content', 'matematika_tema_lazy_loading_images');

// Dodaj Schema.org markup za edukativni sadržaj
function matematika_tema_add_schema_markup() {
    if (is_singular('page') || is_singular('post')) {
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'EducationalOrganization',
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => get_permalink(),
            'teaches' => 'Matematika',
            'educationalLevel' => 'Osnovna škola'
        );
        
        echo '<script type="application/ld+json">' . wp_json_encode($schema) . '</script>';
    }
}
add_action('wp_footer', 'matematika_tema_add_schema_markup');

// Optimizacija brzine učitavanja
function matematika_tema_optimize_loading() {
    // Preload važnih resursa
    echo '<link rel="preload" href="' . get_stylesheet_uri() . '" as="style">';
    
    // DNS prefetch za vanjske resurse
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">';
    echo '<link rel="dns-prefetch" href="//google-analytics.com">';
}
add_action('wp_head', 'matematika_tema_optimize_loading', 1);

// Generiranje Sitemap XML-a
function matematika_tema_generate_sitemap() {
    $sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $sitemap_content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    
    // Dodaj homepage
    $sitemap_content .= matematika_tema_get_sitemap_url(home_url('/'), '1.0', 'daily');
    
    // Dodaj stranice
    $pages = get_pages();
    foreach ($pages as $page) {
        $sitemap_content .= matematika_tema_get_sitemap_url(get_permalink($page->ID), '0.8', 'weekly');
    }
    
    // Dodaj postove
    $posts = get_posts(array('posts_per_page' => -1));
    foreach ($posts as $post) {
        $sitemap_content .= matematika_tema_get_sitemap_url(get_permalink($post->ID), '0.6', 'monthly');
    }
    
    // Dodaj custom post types
    $custom_types = array('geometric_shapes_game');
    foreach ($custom_types as $type) {
        $custom_posts = get_posts(array('post_type' => $type, 'posts_per_page' => -1));
        foreach ($custom_posts as $post) {
            $sitemap_content .= matematika_tema_get_sitemap_url(get_permalink($post->ID), '0.6', 'weekly');
        }
    }
    
    $sitemap_content .= '</urlset>';
    
    // Spremi sitemap.xml
    $sitemap_path = get_template_directory() . '/sitemap.xml';
    file_put_contents($sitemap_path, $sitemap_content);
}

// Helper funkcija za generiranje URL unosa u sitemap
function matematika_tema_get_sitemap_url($url, $priority, $changefreq) {
    return "\t<url>\n" .
           "\t\t<loc>" . esc_url($url) . "</loc>\n" .
           "\t\t<lastmod>" . date('c') . "</lastmod>\n" .
           "\t\t<changefreq>" . esc_html($changefreq) . "</changefreq>\n" .
           "\t\t<priority>" . esc_html($priority) . "</priority>\n" .
           "\t</url>\n";
}

// Generiraj sitemap kada se spremi post ili stranica
function matematika_tema_update_sitemap($post_id) {
    if (wp_is_post_revision($post_id)) {
        return;
    }
    matematika_tema_generate_sitemap();
}
add_action('save_post', 'matematika_tema_update_sitemap');

// Generiraj sitemap pri aktivaciji teme
function matematika_tema_activate() {
    matematika_tema_generate_sitemap();
}
add_action('after_switch_theme', 'matematika_tema_activate');
