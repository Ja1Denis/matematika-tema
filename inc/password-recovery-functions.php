<?php
/**
 * Password recovery related functions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Debug function to log emails
 */
function log_email($to, $subject, $message, $headers) {
    $log_file = WP_CONTENT_DIR . '/email-log.txt';
    $log_entry = sprintf(
        "\n\n=== Email Log Entry %s ===\n" .
        "To: %s\n" .
        "Subject: %s\n" .
        "Headers: %s\n" .
        "Message:\n%s\n" .
        "================================",
        current_time('mysql'),
        $to,
        $subject,
        print_r($headers, true),
        $message
    );
    file_put_contents($log_file, $log_entry, FILE_APPEND);
    return true;
}

/**
 * Handle password recovery request
 */
function handle_password_recovery_request() {
    check_ajax_referer('recovery-nonce', 'nonce');

    error_log('DEBUG MODE STATUS: ' . (defined('WP_DEBUG') && WP_DEBUG ? 'ON' : 'OFF'));
    error_log('Recovery request received for email: ' . $_POST['email']);

    $email = sanitize_email($_POST['email']);

    if (empty($email)) {
        wp_send_json_error(array(
            'message' => 'Molimo unesite email adresu.'
        ));
    }

    $user = get_user_by('email', $email);

    if (!$user) {
        // Iz sigurnosnih razloga, ne otkrivamo da korisnik ne postoji
        wp_send_json_success(array(
            'message' => 'Ako postoji korisnički račun s ovom email adresom, poslat ćemo vam upute za oporavak lozinke.',
            'debug_info' => 'User not found'
        ));
        return;
    }

    // Generiraj ključ za oporavak
    $key = get_password_reset_key($user);
    
    if (is_wp_error($key)) {
        wp_send_json_error(array(
            'message' => 'Došlo je do greške prilikom generiranja ključa za oporavak.'
        ));
        return;
    }

    // Pripremi email poruku
    $reset_link = add_query_arg(array(
        'key' => $key,
        'login' => rawurlencode($user->user_login)
    ), site_url('/oporavak-lozinke'));

    error_log('Reset link generated: ' . $reset_link);

    $to = $email;
    $subject = 'MatematikaPRO - Oporavak lozinke';
    $message = sprintf(
        "Poštovani/a,\n\n" .
        "Primili smo zahtjev za oporavak lozinke za vaš MatematikaPRO račun.\n\n" .
        "Ako niste zatražili oporavak lozinke, možete ignorirati ovu poruku.\n\n" .
        "Za postavljanje nove lozinke, kliknite na sljedeći link:\n%s\n\n" .
        "Link je valjan 24 sata.\n\n" .
        "Srdačan pozdrav,\nMatematikaPRO tim",
        $reset_link
    );
    $headers = array('Content-Type: text/plain; charset=UTF-8');

    // Uvijek vraćamo link u razvojnom modu
    wp_send_json_success(array(
        'message' => 'DEVELOPMENT MODE: Link za oporavak lozinke:',
        'reset_link' => $reset_link,
        'debug_mode' => defined('WP_DEBUG') && WP_DEBUG ? 'true' : 'false'
    ));
}
/**
 * Handle password reset
 */
function handle_password_reset() {
    check_ajax_referer('recovery-nonce', 'nonce');

    $password = $_POST['password'];
    $key = $_POST['key'];
    $login = $_POST['login'];

    if (empty($password) || empty($key) || empty($login)) {
        wp_send_json_error(array(
            'message' => 'Nedostaju potrebni podaci.'
        ));
    }

    $user = check_password_reset_key($key, $login);

    if (is_wp_error($user)) {
        wp_send_json_error(array(
            'message' => 'Link za oporavak lozinke je istekao ili nije valjan. Molimo zatražite novi link.'
        ));
        return;
    }

    if (strlen($password) < 8) {
        wp_send_json_error(array(
            'message' => 'Lozinka mora imati najmanje 8 znakova.'
        ));
        return;
    }

    // Postavi novu lozinku
    reset_password($user, $password);

    wp_send_json_success(array(
        'message' => 'Lozinka je uspješno promijenjena.'
    ));
}
add_action('wp_ajax_nopriv_reset_password', 'handle_password_reset');
add_action('wp_ajax_reset_password', 'handle_password_reset');

/**
 * Enqueue password recovery scripts and styles
 */
function enqueue_recovery_assets() {
    if (is_page_template('page-templates/password-recovery-template.php')) {
        wp_enqueue_script('password-recovery', get_template_directory_uri() . '/js/password-recovery.js', array('jquery'), '1.0.0', true);
        
        wp_localize_script('password-recovery', 'recoveryData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'loginUrl' => site_url('/prijava'),
            'nonce' => wp_create_nonce('recovery-nonce')
        ));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_recovery_assets');

add_action('wp_ajax_nopriv_request_password_recovery', 'handle_password_recovery_request');
add_action('wp_ajax_request_password_recovery', 'handle_password_recovery_request');
