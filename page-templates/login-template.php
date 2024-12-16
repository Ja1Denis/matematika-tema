<?php
/**
 * Template Name: Prijava
 * 
 * @package MatematikaPRO
 */

get_header(); ?>

<div class="login-container">
    <div class="login-box">
        <div class="login-header">
            <h1>Dobrodošli natrag</h1>
            <p>Prijavite se u svoj račun</p>
        </div>

        <form class="login-form" id="login-form">
            <?php wp_nonce_field('ajax-login-nonce', 'security'); ?>
            <div class="form-group">
                <input type="email" id="email" name="email" placeholder="Email adresa" required>
                <div class="error-message" id="email-error"></div>
            </div>
            <div class="form-group">
                <input type="password" id="password" name="password" placeholder="Lozinka" required>
                <span class="password-toggle" id="password-toggle">👁️</span>
                <div class="error-message" id="password-error"></div>
            </div>
            <div class="form-options">
                <div class="remember-me">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Zapamti me</label>
                </div>
                <div class="forgot-password">
                    <a href="<?php echo site_url('/oporavak-lozinke'); ?>">Zaboravili ste lozinku?</a>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Prijavi se</button>
        </form>

        <div class="register-link">
            Nemate račun? <a href="<?php echo site_url('/registracija'); ?>">Registrirajte se</a>
        </div>
    </div>
</div>

<?php
wp_enqueue_script('login-js', get_template_directory_uri() . '/js/login.js', array('jquery'), '1.0', true);
get_footer(); ?>
