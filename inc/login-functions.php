<?php
/**
 * Login related functions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handle AJAX login
 */
function handle_ajax_login() {
    check_ajax_referer('ajax-login-nonce', 'security');

    $email = sanitize_email($_POST['email']);
    $password = $_POST['password'];
    $remember = isset($_POST['remember']) ? (bool) $_POST['remember'] : false;

    if (empty($email) || empty($password)) {
        wp_send_json_error(array(
            'message' => 'Molimo unesite email i lozinku.'
        ));
    }

    $user = get_user_by('email', $email);

    if (!$user) {
        wp_send_json_error(array(
            'message' => 'Korisnik s ovom email adresom ne postoji.'
        ));
    }

    $creds = array(
        'user_login'    => $user->user_login,
        'user_password' => $password,
        'remember'      => $remember
    );

    $user = wp_signon($creds, is_ssl());

    if (is_wp_error($user)) {
        wp_send_json_error(array(
            'message' => 'Pogrešna lozinka. Molimo pokušajte ponovno.'
        ));
    }

    wp_send_json_success(array(
        'redirect' => site_url('/dashboard')
    ));
}
add_action('wp_ajax_nopriv_ajax_login', 'handle_ajax_login');

/**
 * Enqueue login scripts and styles
 */
function enqueue_login_assets() {
    if (is_page_template('page-templates/login-template.php') || 
        is_page_template('page-templates/register-template.php') ||
        is_page_template('page-templates/password-recovery-template.php')) {
        
        wp_enqueue_style('login-style', get_template_directory_uri() . '/css/login.css', array(), '1.0.0');
        wp_enqueue_script('login-script', get_template_directory_uri() . '/js/login.js', array('jquery'), '1.0.0', true);
        
        wp_localize_script('login-script', 'ajaxurl', admin_url('admin-ajax.php'));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_login_assets');

/**
 * Redirect logged-in users from login/register pages
 */
function redirect_logged_in_users() {
    if (is_user_logged_in() && 
        (is_page_template('page-templates/login-template.php') || 
         is_page_template('page-templates/register-template.php'))) {
        wp_redirect(site_url('/dashboard'));
        exit;
    }
}
add_action('template_redirect', 'redirect_logged_in_users');
