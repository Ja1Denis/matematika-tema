<?php
/**
 * Template Name: Registracija
 * 
 * @package MatematikaPRO
 */

get_header();
?>

<div class="register-container">
    <div class="register-box">
        <div class="register-header">
            <h1>Stvorite račun</h1>
            <p>Pridružite se MatematikaPRO zajednici</p>
        </div>

        <form class="register-form" id="register-form">
            <?php wp_nonce_field('ajax-register-nonce', 'security'); ?>
            
            <div class="form-group">
                <input type="text" id="name" name="name" placeholder="Ime i prezime" required>
                <div class="error-message" id="name-error"></div>
            </div>
            
            <div class="form-group">
                <input type="email" id="email" name="email" placeholder="Email adresa" required>
                <div class="error-message" id="email-error"></div>
            </div>
            
            <div class="form-group">
                <div class="password-input-wrapper">
                    <input type="password" id="password" name="password" placeholder="Lozinka" required>
                    <span class="password-toggle" id="password-toggle">👁️</span>
                </div>
                <div class="error-message" id="password-error"></div>
                <div class="password-requirements">
                    Lozinka mora sadržavati najmanje 8 znakova, jedno veliko slovo, jedno malo slovo i jedan broj
                </div>
            </div>

            <div class="form-group">
                <div class="password-input-wrapper">
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="Potvrdi lozinku" required>
                    <span class="password-toggle" id="confirm-password-toggle">👁️</span>
                </div>
                <div class="error-message" id="confirm-password-error"></div>
            </div>

            <div class="terms-privacy">
                <label>
                    <input type="checkbox" id="terms" name="terms" required>
                    Prihvaćam <a href="<?php echo home_url('/uvjeti-koristenja'); ?>" target="_blank">Uvjete korištenja</a> 
                    i <a href="<?php echo home_url('/privatnost'); ?>" target="_blank">Politiku privatnosti</a>
                </label>
                <div class="error-message" id="terms-error"></div>
            </div>

            <button type="submit" class="register-button">Registrirajte se</button>
        </form>

        <div class="login-prompt">
            Već imate račun? <a href="<?php echo home_url('/prijava'); ?>">Prijavite se</a>
        </div>
    </div>
</div>

<?php
wp_enqueue_script('register-js', get_template_directory_uri() . '/js/register.js', array('jquery'), '1.0', true);
wp_localize_script('register-js', 'ajaxurl', admin_url('admin-ajax.php'));
get_footer();
?>
