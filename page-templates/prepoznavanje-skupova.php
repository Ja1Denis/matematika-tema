<?php
/**
 * Template Name: Prepoznavanje Skupova
 * Description: Predložak za vježbu prepoznavanja brojeva koji ne pripadaju skupu
 */

get_header();

<?php
// Enqueue potrebne skripte i stilove
function enqueue_prepoznavanje_skupova_assets() {
    if (is_page_template('page-templates/prepoznavanje-skupova.php')) {
        // Font Awesome
        wp_enqueue_style('font-awesome', 
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
        );
        
        // Custom CSS
        wp_enqueue_style('prepoznavanje-skupova-style', 
            get_template_directory_uri() . '/css/prepoznavanje-skupova.css',
            array(),
            filemtime(get_template_directory() . '/css/prepoznavanje-skupova.css')
        );

        // jQuery (već uključen u WordPress)
        wp_enqueue_script('jquery');

        // Custom JavaScript
        wp_enqueue_script('prepoznavanje-skupova-script',
            get_template_directory_uri() . '/js/prepoznavanje-skupova.js',
            array('jquery'),
            filemtime(get_template_directory() . '/js/prepoznavanje-skupova.js'),
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'enqueue_prepoznavanje_skupova_assets');
?>

<?php get_footer(); ?>
