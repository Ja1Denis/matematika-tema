<?php
/**
 * AJAX handlers for Language Learning Application
 */

// Add AJAX handlers for both logged in and non-logged in users
add_action('wp_ajax_get_new_words', 'handle_get_new_words');
add_action('wp_ajax_nopriv_get_new_words', 'handle_get_new_words');

function handle_get_new_words() {
    // Get random words from the database
    $words = get_random_words(10);
    
    // Send JSON response
    wp_send_json_success(array(
        'words' => $words
    ));
}

// Function to load AJAX handlers
function load_language_learning_ajax() {
    require_once get_template_directory() . '/includes/language-learning-ajax.php';
}
add_action('init', 'load_language_learning_ajax');
?>
