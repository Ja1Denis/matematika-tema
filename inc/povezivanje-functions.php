<?php
/**
 * Funkcije za aplikaciju povezivanja geometrijskih likova
 */

// Registriramo AJAX endpointe
add_action('wp_ajax_save_povezivanje_result', 'save_povezivanje_result');
add_action('wp_ajax_nopriv_save_povezivanje_result', 'save_povezivanje_result');

add_action('wp_ajax_get_povezivanje_stats', 'get_povezivanje_stats');
add_action('wp_ajax_nopriv_get_povezivanje_stats', 'get_povezivanje_stats');

/**
 * Sprema rezultat igre
 */
function save_povezivanje_result() {
    check_ajax_referer('math_app_nonce', 'nonce');

    global $wpdb;
    $table_name = $wpdb->prefix . 'math_results';

    $user_id = get_current_user_id();
    $score = intval($_POST['score']);
    $time_spent = intval($_POST['time_spent']);
    $difficulty = sanitize_text_field($_POST['difficulty']);
    $game_mode = sanitize_text_field($_POST['game_mode']);

    $result = $wpdb->insert(
        $table_name,
        array(
            'user_id' => $user_id,
            'exercise_type' => 'povezivanje',
            'score' => $score,
            'time_spent' => $time_spent,
            'difficulty' => $difficulty,
            'game_mode' => $game_mode,
            'created_at' => current_time('mysql')
        ),
        array('%d', '%s', '%d', '%d', '%s', '%s', '%s')
    );

    if ($result === false) {
        wp_send_json_error('Greška pri spremanju rezultata');
    }

    // Ažuriramo najbolji rezultat ako je potrebno
    $best_score = get_user_meta($user_id, 'povezivanje_best_score', true);
    if ($score > intval($best_score)) {
        update_user_meta($user_id, 'povezivanje_best_score', $score);
    }

    wp_send_json_success(array(
        'message' => 'Rezultat uspješno spremljen',
        'new_best_score' => $score > intval($best_score)
    ));
}

/**
 * Dohvaća statistiku za korisnika
 */
function get_povezivanje_stats() {
    check_ajax_referer('math_app_nonce', 'nonce');

    global $wpdb;
    $table_name = $wpdb->prefix . 'math_results';
    $user_id = get_current_user_id();

    // Dohvaćamo statistiku
    $stats = $wpdb->get_results($wpdb->prepare(
        "SELECT 
            MAX(score) as best_score,
            AVG(score) as avg_score,
            COUNT(*) as total_games,
            AVG(time_spent) as avg_time
        FROM $table_name
        WHERE user_id = %d AND exercise_type = 'povezivanje'",
        $user_id
    ));

    if (!$stats) {
        wp_send_json_error('Nema dostupne statistike');
    }

    // Dohvaćamo napredak po težinama
    $difficulty_stats = $wpdb->get_results($wpdb->prepare(
        "SELECT 
            difficulty,
            COUNT(*) as games_played,
            AVG(score) as avg_score
        FROM $table_name
        WHERE user_id = %d AND exercise_type = 'povezivanje'
        GROUP BY difficulty",
        $user_id
    ));

    wp_send_json_success(array(
        'general_stats' => $stats[0],
        'difficulty_stats' => $difficulty_stats
    ));
}

/**
 * Kreira tablicu za rezultate ako ne postoji
 */
function create_povezivanje_results_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'math_results';
    
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        exercise_type varchar(50) NOT NULL,
        score int(11) NOT NULL,
        time_spent int(11) NOT NULL,
        difficulty varchar(20) NOT NULL,
        game_mode varchar(20) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY user_id (user_id),
        KEY exercise_type (exercise_type)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// Pozivamo kreiranje tablice pri aktivaciji teme
add_action('after_switch_theme', 'create_povezivanje_results_table');
