<?php
/**
 * Funkcije za registraciju korisnika
 */

// Spriječi direktan pristup
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Obradi AJAX registraciju
 */
function handle_ajax_register() {
    check_ajax_referer('ajax-register-nonce', 'security');

    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $password = $_POST['password'];

    // Validacija
    if (empty($name) || empty($email) || empty($password)) {
        wp_send_json_error(array(
            'message' => 'Sva polja su obavezna.',
            'field' => empty($name) ? 'name' : (empty($email) ? 'email' : 'password')
        ));
    }

    if (!is_email($email)) {
        wp_send_json_error(array(
            'message' => 'Molimo unesite ispravnu email adresu.',
            'field' => 'email'
        ));
    }

    if (email_exists($email)) {
        wp_send_json_error(array(
            'message' => 'Ova email adresa je već registrirana.',
            'field' => 'email'
        ));
    }

    // Kreiraj korisnika
    $username = sanitize_user(current(explode('@', $email)));
    $i = 1;
    while (username_exists($username)) {
        $username = sanitize_user(current(explode('@', $email))) . $i;
        $i++;
    }

    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        wp_send_json_error(array(
            'message' => $user_id->get_error_message()
        ));
    }

    // Ažuriraj korisničke podatke
    wp_update_user(array(
        'ID' => $user_id,
        'display_name' => $name
    ));

    // Prijavi korisnika
    wp_set_auth_cookie($user_id, true);

    // Pošalji email dobrodošlice
    $to = $email;
    $subject = 'Dobrodošli na MatematikaPRO';
    $message = sprintf(
        'Poštovani/a %s,\n\n' .
        'Dobrodošli na MatematikaPRO! Vaš račun je uspješno kreiran.\n\n' .
        'Možete se prijaviti na: %s\n\n' .
        'Srdačan pozdrav,\n' .
        'MatematikaPRO Tim',
        $name,
        site_url('/prijava')
    );
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    
    wp_mail($to, $subject, $message, $headers);

    wp_send_json_success(array(
        'redirect' => site_url('/dashboard')
    ));
}
add_action('wp_ajax_nopriv_ajax_register', 'handle_ajax_register');

/**
 * Učitaj skripte i stilove za registraciju
 */
function enqueue_register_assets() {
    if (is_page_template('page-templates/register-template.php')) {
        wp_enqueue_script('register-script', get_template_directory_uri() . '/js/register.js', array('jquery'), '1.0.0', true);
        wp_localize_script('register-script', 'ajaxurl', admin_url('admin-ajax.php'));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_register_assets');
