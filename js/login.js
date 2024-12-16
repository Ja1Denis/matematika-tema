jQuery(document).ready(function($) {
    // Password visibility toggle
    $('#password-toggle').on('click', function() {
        const passwordInput = $('#password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).text(type === 'password' ? '👁️' : '👁️‍🗨️');
    });

    // Form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();
        const password = $('#password').val();
        const remember = $('#remember').is(':checked');
        const security = $('#security').val();

        // Reset error messages
        $('.error-message').removeClass('show');

        // Basic validation
        let hasError = false;
        if (!email) {
            $('#email-error').text('Molimo unesite email adresu').addClass('show');
            hasError = true;
        } else if (!isValidEmail(email)) {
            $('#email-error').text('Molimo unesite ispravnu email adresu').addClass('show');
            hasError = true;
        }

        if (!password) {
            $('#password-error').text('Molimo unesite lozinku').addClass('show');
            hasError = true;
        }

        if (hasError) return;

        // Disable form submission
        const submitButton = $(this).find('button[type="submit"]');
        const originalButtonText = submitButton.text();
        submitButton.prop('disabled', true).text('Prijava u tijeku...');

        // AJAX login request
        $.ajax({
            url: loginData.ajaxurl,
            type: 'POST',
            data: {
                action: 'ajax_login',
                email: email,
                password: password,
                remember: remember,
                security: security // Only use the form nonce
            },
            success: function(response) {
                if (response.success) {
                    window.location.href = response.data.redirect;
                } else {
                    $('#password-error').text(response.data.message).addClass('show');
                    submitButton.prop('disabled', false).text(originalButtonText);
                }
            },
            error: function() {
                $('#password-error').text('Došlo je do greške. Molimo pokušajte ponovno.').addClass('show');
                submitButton.prop('disabled', false).text(originalButtonText);
            }
        });
    });

    // Helper functions
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
