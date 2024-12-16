jQuery(document).ready(function($) {
    // Provjera URL parametara za prikaz odgovarajuće forme
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    const login = urlParams.get('login');

    if (key && login) {
        $('#recovery-request-form').hide();
        $('#reset-password-form').show();
        $('#reset-key').val(key);
        $('#user-login').val(login);
    }

    // Password visibility toggles
    $('#new-password-toggle').on('click', function() {
        const passwordInput = $('#new-password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).text(type === 'password' ? '👁️' : '👁️‍🗨️');
    });

    $('#confirm-password-toggle').on('click', function() {
        const passwordInput = $('#confirm-password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).text(type === 'password' ? '👁️' : '👁️‍🗨️');
    });

    // Forma za zahtjev oporavka lozinke
    $('#recovery-request-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();

        // Reset error messages
        $('.error-message').removeClass('show');

        // Basic validation
        if (!email) {
            $('#email-error').text('Molimo unesite email adresu').addClass('show');
            return;
        }

        if (!isValidEmail(email)) {
            $('#email-error').text('Molimo unesite ispravnu email adresu').addClass('show');
            return;
        }

        // Disable form submission
        const submitButton = $(this).find('button[type="submit"]');
        const originalButtonText = submitButton.text();
        submitButton.prop('disabled', true).text('Slanje...');

        // AJAX request
        $.ajax({
            url: recoveryData.ajaxurl,
            type: 'POST',
            data: {
                action: 'request_password_recovery',
                email: email,
                nonce: recoveryData.nonce
            },
            success: function(response) {
                if (response.success) {
                    let message = '<div class="success-message">';
                    
                    if (response.data.reset_link) {
                        // Development mode - prikaži link
                        message += '<h3>Link za oporavak lozinke (Development Mode):</h3>' +
                                 '<p><a href="' + response.data.reset_link + '">' + response.data.reset_link + '</a></p>';
                    } else {
                        // Production mode - standardna poruka
                        message += '<h3>Email je poslan!</h3>' +
                                 '<p>Poslali smo vam upute za oporavak lozinke na vašu email adresu.</p>' +
                                 '<p>Molimo provjerite svoj inbox i spam folder.</p>';
                    }
                    
                    message += '</div>';
                    
                    $('#recovery-request-form').html(message);
                } else {
                    $('#email-error').text(response.data.message).addClass('show');
                    submitButton.prop('disabled', false).text(originalButtonText);
                }
            },
            error: function() {
                $('#email-error').text('Došlo je do greške. Molimo pokušajte ponovno.').addClass('show');
                submitButton.prop('disabled', false).text(originalButtonText);
            }
        });
    });

    // Forma za postavljanje nove lozinke
    $('#reset-password-form').on('submit', function(e) {
        e.preventDefault();
        
        const newPassword = $('#new-password').val();
        const confirmPassword = $('#confirm-password').val();
        const resetKey = $('#reset-key').val();
        const userLogin = $('#user-login').val();

        // Reset error messages
        $('.error-message').removeClass('show');

        // Basic validation
        let hasError = false;
        if (!newPassword) {
            $('#new-password-error').text('Molimo unesite novu lozinku').addClass('show');
            hasError = true;
        } else if (newPassword.length < 8) {
            $('#new-password-error').text('Lozinka mora imati najmanje 8 znakova').addClass('show');
            hasError = true;
        }

        if (!confirmPassword) {
            $('#confirm-password-error').text('Molimo potvrdite lozinku').addClass('show');
            hasError = true;
        } else if (newPassword !== confirmPassword) {
            $('#confirm-password-error').text('Lozinke se ne podudaraju').addClass('show');
            hasError = true;
        }

        if (hasError) return;

        // Disable form submission
        const submitButton = $(this).find('button[type="submit"]');
        const originalButtonText = submitButton.text();
        submitButton.prop('disabled', true).text('Postavljanje...');

        // AJAX request
        $.ajax({
            url: recoveryData.ajaxurl,
            type: 'POST',
            data: {
                action: 'reset_password',
                password: newPassword,
                key: resetKey,
                login: userLogin,
                nonce: recoveryData.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Prikaži poruku o uspjehu i preusmjeri na prijavu nakon 3 sekunde
                    $('#reset-password-form').html(
                        '<div class="success-message">' +
                        '<h3>Lozinka je uspješno promijenjena!</h3>' +
                        '<p>Preusmjeravamo vas na stranicu za prijavu...</p>' +
                        '</div>'
                    );
                    setTimeout(function() {
                        window.location.href = recoveryData.loginUrl;
                    }, 3000);
                } else {
                    $('#new-password-error').text(response.data.message).addClass('show');
                    submitButton.prop('disabled', false).text(originalButtonText);
                }
            },
            error: function() {
                $('#new-password-error').text('Došlo je do greške. Molimo pokušajte ponovno.').addClass('show');
                submitButton.prop('disabled', false).text(originalButtonText);
            }
        });
    });

    // Helper function
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
