<?php
/**
 * Template Name: Oporavak Lozinke
 * 
 * @package MatematikaPRO
 */

get_header(); ?>

<main class="password-recovery-page">
    <div class="auth-container">
        <h1>Oporavak lozinke</h1>
        
        <!-- Forma za unos emaila -->
        <form id="recovery-request-form" class="auth-form" style="display: block;">
            <div class="form-group">
                <label for="email">Email adresa</label>
                <input type="email" id="email" name="email" required>
                <div id="email-error" class="error-message"></div>
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Pošalji link za oporavak</button>
            </div>
            
            <div class="form-links">
                <a href="<?php echo site_url('/prijava'); ?>">Natrag na prijavu</a>
            </div>
        </form>

        <!-- Forma za postavljanje nove lozinke (inicijalno skrivena) -->
        <form id="reset-password-form" class="auth-form" style="display: none;">
            <div class="form-group">
                <label for="new-password">Nova lozinka</label>
                <div class="password-input-group">
                    <input type="password" id="new-password" name="new-password" required>
                    <button type="button" id="new-password-toggle" class="password-toggle">👁️</button>
                </div>
                <div id="new-password-error" class="error-message"></div>
            </div>

            <div class="form-group">
                <label for="confirm-password">Potvrdi lozinku</label>
                <div class="password-input-group">
                    <input type="password" id="confirm-password" name="confirm-password" required>
                    <button type="button" id="confirm-password-toggle" class="password-toggle">👁️</button>
                </div>
                <div id="confirm-password-error" class="error-message"></div>
            </div>

            <input type="hidden" id="reset-key" name="reset-key">
            <input type="hidden" id="user-login" name="user-login">
            
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Postavi novu lozinku</button>
            </div>
            
            <div class="form-links">
                <a href="<?php echo site_url('/prijava'); ?>">Natrag na prijavu</a>
            </div>
        </form>
    </div>
</main>

<?php get_footer(); ?>
