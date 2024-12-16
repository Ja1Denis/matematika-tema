jQuery(document).ready(function($) {
    // Kontrola vidljivosti lozinke
    $('.password-toggle').on('click', function() {
        const passwordInput = $(this).siblings('input');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).text(type === 'password' ? '👁️' : '👁️‍🗨️');
    });

    // Validacija forme
    function provjeriLozinku(lozinka) {
        // Minimalno 8 znakova, barem jedno veliko slovo, jedno malo slovo i jedan broj
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(lozinka);
    }

    function provjeriEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Slanje forme
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        
        const ime = $('#name').val().trim();
        const email = $('#email').val().trim();
        const lozinka = $('#password').val();
        const potvrdaLozinke = $('#confirm_password').val();
        const uvjeti = $('#terms').is(':checked');
        const security = $('#security').val();

        // Resetiraj poruke o greškama
        $('.error-message').removeClass('show');

        // Validacija
        let imaGreska = false;

        if (!ime) {
            $('#name-error').text('Molimo unesite ime i prezime').addClass('show');
            imaGreska = true;
        }

        if (!email) {
            $('#email-error').text('Molimo unesite email adresu').addClass('show');
            imaGreska = true;
        } else if (!provjeriEmail(email)) {
            $('#email-error').text('Molimo unesite ispravnu email adresu').addClass('show');
            imaGreska = true;
        }

        if (!lozinka) {
            $('#password-error').text('Molimo unesite lozinku').addClass('show');
            imaGreska = true;
        } else if (!provjeriLozinku(lozinka)) {
            $('#password-error').text('Lozinka mora sadržavati najmanje 8 znakova, jedno veliko slovo, jedno malo slovo i jedan broj').addClass('show');
            imaGreska = true;
        }

        if (!potvrdaLozinke) {
            $('#confirm-password-error').text('Molimo potvrdite lozinku').addClass('show');
            imaGreska = true;
        } else if (lozinka !== potvrdaLozinke) {
            $('#confirm-password-error').text('Lozinke se ne podudaraju').addClass('show');
            imaGreska = true;
        }

        if (!uvjeti) {
            $('#terms-error').text('Morate prihvatiti uvjete korištenja i politiku privatnosti').addClass('show');
            imaGreska = true;
        }

        if (imaGreska) return;

        // Onemogući gumb za slanje
        const submitButton = $(this).find('button[type="submit"]');
        const originalButtonText = submitButton.text();
        submitButton.prop('disabled', true).text('Registracija u tijeku...');

        // AJAX zahtjev za registraciju
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'ajax_register',
                name: ime,
                email: email,
                password: lozinka,
                security: security
            },
            success: function(response) {
                if (response.success) {
                    window.location.href = response.data.redirect;
                } else {
                    if (response.data.field) {
                        $(`#${response.data.field}-error`).text(response.data.message).addClass('show');
                    } else {
                        $('#password-error').text(response.data.message).addClass('show');
                    }
                    submitButton.prop('disabled', false).text(originalButtonText);
                }
            },
            error: function() {
                $('#password-error').text('Došlo je do greške. Molimo pokušajte ponovno.').addClass('show');
                submitButton.prop('disabled', false).text(originalButtonText);
            }
        });
    });

    // Social registration handlers (development mode)
    $('#google-register').on('click', function() {
        // U razvoju simuliramo uspješnu prijavu
        console.log('Google registracija - razvojni način rada');
        $.ajax({
            url: registerData.ajaxurl,
            type: 'POST',
            data: {
                action: 'google_register',
                credential: 'test_credential',
                security: $('#security').val()
            },
            success: function(response) {
                if (response.success) {
                    window.location.href = response.data.redirect;
                } else {
                    $('#password-error').text(response.data.message).addClass('show');
                }
            },
            error: function() {
                $('#password-error').text('Došlo je do greške prilikom Google registracije').addClass('show');
            }
        });
    });

    $('#facebook-register').on('click', function() {
        // U razvoju simuliramo uspješnu prijavu
        console.log('Facebook registracija - razvojni način rada');
        $.ajax({
            url: registerData.ajaxurl,
            type: 'POST',
            data: {
                action: 'facebook_register',
                access_token: 'test_token',
                security: $('#security').val()
            },
            success: function(response) {
                if (response.success) {
                    window.location.href = response.data.redirect;
                } else {
                    $('#password-error').text(response.data.message).addClass('show');
                }
            },
            error: function() {
                $('#password-error').text('Došlo je do greške prilikom Facebook registracije').addClass('show');
            }
        });
    });

    $('#x-register').on('click', function() {
        console.log('X/Twitter registracija nije još implementirana');
        $('#password-error').text('X/Twitter registracija trenutno nije dostupna').addClass('show');
    });

    $('#apple-register').on('click', function() {
        console.log('Apple registracija nije još implementirana');
        $('#password-error').text('Apple registracija trenutno nije dostupna').addClass('show');
    });
});
