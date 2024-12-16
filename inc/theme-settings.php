<?php
/**
 * Theme Settings Page
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add theme settings page
 */
function matematika_add_theme_settings() {
    add_menu_page(
        'MatematikaPRO Postavke',
        'MatematikaPRO',
        'manage_options',
        'matematika-settings',
        'matematika_settings_page',
        'dashicons-welcome-learn-more',
        20
    );
}
add_action('admin_menu', 'matematika_add_theme_settings');

/**
 * Register settings
 */
function matematika_register_settings() {
    // Google settings
    register_setting('matematika_settings', 'google_client_id');
    register_setting('matematika_settings', 'google_client_secret');

    // Facebook settings
    register_setting('matematika_settings', 'facebook_app_id');
    register_setting('matematika_settings', 'facebook_app_secret');

    // Twitter/X settings
    register_setting('matematika_settings', 'twitter_client_id');
    register_setting('matematika_settings', 'twitter_client_secret');

    // Apple settings
    register_setting('matematika_settings', 'apple_client_id');
    register_setting('matematika_settings', 'apple_team_id');
    register_setting('matematika_settings', 'apple_key_id');
    register_setting('matematika_settings', 'apple_private_key');
}
add_action('admin_init', 'matematika_register_settings');

/**
 * Settings page content
 */
function matematika_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_GET['settings-updated'])) {
        add_settings_error(
            'matematika_messages',
            'matematika_message',
            'Postavke su spremljene',
            'updated'
        );
    }

    settings_errors('matematika_messages');
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('matematika_settings');
            ?>
            
            <h2>Google prijava</h2>
            <p class="description">
                Za postavljanje Google prijave, potrebno je kreirati projekt u 
                <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>
                i omogućiti Google Sign-In API.
            </p>
            <table class="form-table">
                <tr>
                    <th scope="row">Client ID</th>
                    <td>
                        <input type="text" name="google_client_id" 
                               value="<?php echo esc_attr(get_option('google_client_id')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Client Secret</th>
                    <td>
                        <input type="password" name="google_client_secret" 
                               value="<?php echo esc_attr(get_option('google_client_secret')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
            </table>

            <h2>Facebook prijava</h2>
            <p class="description">
                Za postavljanje Facebook prijave, potrebno je kreirati aplikaciju u 
                <a href="https://developers.facebook.com/" target="_blank">Facebook Developers</a>
                i omogućiti Facebook Login.
            </p>
            <table class="form-table">
                <tr>
                    <th scope="row">App ID</th>
                    <td>
                        <input type="text" name="facebook_app_id" 
                               value="<?php echo esc_attr(get_option('facebook_app_id')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">App Secret</th>
                    <td>
                        <input type="password" name="facebook_app_secret" 
                               value="<?php echo esc_attr(get_option('facebook_app_secret')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
            </table>

            <h2>Twitter/X prijava</h2>
            <p class="description">
                Za postavljanje Twitter/X prijave, potrebno je kreirati projekt u 
                <a href="https://developer.twitter.com/" target="_blank">Twitter Developer Portal</a>.
            </p>
            <table class="form-table">
                <tr>
                    <th scope="row">Client ID</th>
                    <td>
                        <input type="text" name="twitter_client_id" 
                               value="<?php echo esc_attr(get_option('twitter_client_id')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Client Secret</th>
                    <td>
                        <input type="password" name="twitter_client_secret" 
                               value="<?php echo esc_attr(get_option('twitter_client_secret')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
            </table>

            <h2>Apple prijava</h2>
            <p class="description">
                Za postavljanje Apple prijave, potrebno je registrirati aplikaciju u 
                <a href="https://developer.apple.com/" target="_blank">Apple Developer</a>
                i kreirati Service ID.
            </p>
            <table class="form-table">
                <tr>
                    <th scope="row">Client ID</th>
                    <td>
                        <input type="text" name="apple_client_id" 
                               value="<?php echo esc_attr(get_option('apple_client_id')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Team ID</th>
                    <td>
                        <input type="text" name="apple_team_id" 
                               value="<?php echo esc_attr(get_option('apple_team_id')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Key ID</th>
                    <td>
                        <input type="text" name="apple_key_id" 
                               value="<?php echo esc_attr(get_option('apple_key_id')); ?>" 
                               class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row">Private Key</th>
                    <td>
                        <textarea name="apple_private_key" class="large-text" rows="5"><?php 
                            echo esc_textarea(get_option('apple_private_key')); 
                        ?></textarea>
                    </td>
                </tr>
            </table>

            <?php submit_button('Spremi postavke'); ?>
        </form>
    </div>
    <?php
}

/**
 * Add settings link to plugins page
 */
function matematika_add_settings_link($links) {
    $settings_link = '<a href="admin.php?page=matematika-settings">' . __('Postavke') . '</a>';
    array_unshift($links, $settings_link);
    return $links;
}
$plugin_file = 'matematika-tema/matematika-tema.php';
add_filter("plugin_action_links_$plugin_file", 'matematika_add_settings_link');
