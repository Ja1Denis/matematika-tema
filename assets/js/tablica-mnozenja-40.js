jQuery(document).ready(function($) {
    // Globalne varijable
    const BROJ = 4;
    let timer;
    let timeLeft = 300;
    let score = 0;
    let currentTasks = [];
    let isTestActive = false;

    // Generiranje tablice množenja
    function generirajTablicu() {
        const tablica = $('#tablicaMnozenja40');
        tablica.empty();
        
        // Dodavanje zaglavlja
        let headerRow = $('<tr>');
        headerRow.append($('<th>').text('×'));
        for(let i = 1; i <= 10; i++) {
            headerRow.append($('<th>').text(i));
        }
        tablica.append(headerRow);

        // Dodavanje reda za broj 4
        for (let i = 1; i <= 4; i++) {
            let row = $('<tr>');
            row.append($('<th>').text(i));
            for(let j = 1; j <= 10; j++) {
                let cell = $('<td>').text(i * j);
                // Dodaj data atribute za lakše pronalaženje ćelije
                cell.attr('data-broj1', i);
                cell.attr('data-broj2', j);
                row.append(cell);
            }
            tablica.append(row);
        }
    }

    // Generiranje zadataka
    function generirajZadatke() {
        const zadaciContainer = $('#zadaci');
        zadaciContainer.empty();
        currentTasks = [];

        for(let i = 0; i < 10; i++) {
            let broj1 = 4; // Fiksirano na broj 4
            let broj2 = Math.floor(Math.random() * 10) + 1;
            currentTasks.push({broj1, broj2});

            let zadatak = $('<div>')
                .addClass('zadatak')
                .attr('id', `zadatak${i}`);

            let text = $('<span>')
                .text(`${broj1} × ${broj2} = `);

            let input = $('<input>')
                .attr('type', 'number')
                .addClass('odgovor')
                .attr('id', `odgovor${i}`);

            let button = $('<button>')
                .addClass('provjeri-btn')
                .text('Provjeri')
                .click(function() {
                    provjeriOdgovor(i, input.val());
                });

            zadatak.append(text, input, button);
            zadaciContainer.append(zadatak);

            // Dodaj event listener za Enter tipku
            input.on('keypress', function(e) {
                if (e.which === 13) { // 13 je kod za Enter tipku
                    e.preventDefault();
                    provjeriOdgovor(i, $(this).val());
                }
            });
        }
    }

    // Sanitizacija unosa
    function sanitizeInput(input) {
        return parseInt(input.replace(/[^0-9]/g, '')) || 0;
    }

    // Provjera odgovora
    function provjeriOdgovor(zadatakIndex, odgovor) {
        if (!odgovor) return; // Ne provjeravaj ako je polje prazno

        const zadatak = currentTasks[zadatakIndex];
        const tocniOdgovor = zadatak.broj1 * zadatak.broj2;
        const zadatakElement = $(`#zadatak${zadatakIndex}`);
        const inputElement = zadatakElement.find('input');
        const provjeriBtn = zadatakElement.find('.provjeri-btn');
        
        if (parseInt(odgovor) === tocniOdgovor) {
            zadatakElement.removeClass('incorrect').addClass('correct');
            inputElement.prop('disabled', true);
            provjeriBtn.prop('disabled', true);
            
            // Označi odgovarajuću ćeliju u tablici
            const celija = $(`#tablicaMnozenja40 td[data-broj1="${zadatak.broj1}"][data-broj2="${zadatak.broj2}"]`);
            celija.addClass('correct');
            
            if (isTestActive) {
                score++;
                $('#bodovi').text(score);
            }
        } else {
            zadatakElement.removeClass('correct').addClass('incorrect');
            inputElement.val('').focus(); // Očisti input i postavi fokus za novi pokušaj
        }

        if (score === 10) {
            zavrsiTest(true);
        }
    }

    // Timer funkcionalnost
    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;
            $('#vrijeme').text(timeLeft);
            
            if (timeLeft <= 0) {
                zavrsiTest(false);
            }
        }, 1000);
    }

    // Završetak testa
    function zavrsiTest(uspjesno) {
        clearInterval(timer);
        isTestActive = false;
        
        if (uspjesno) {
            alert('Čestitamo! Uspješno ste riješili sve zadatke!');
        } else {
            alert(`Vrijeme je isteklo! Riješili ste ${score} od 10 zadataka.`);
        }

        // Ukloni sve oznake iz tablice
        const tablicaElement = $('#tablicaMnozenja40');
        const celije = tablicaElement.find('td.correct');
        celije.removeClass('correct');
        
        $('.test-info').hide();
        $('#startTest').show();
        $('#generirajZadatke').show();
    }

    // Print funkcionalnost
    function pripremiZaPrint() {
        const printTablica = $('#printTablica');
        const printZadaci = $('#printZadaci');
        
        // Kopiraj trenutnu tablicu
        printTablica.html($('#tablicaMnozenja40').clone());
        
        // Generiraj zadatke za ispis
        let zadaciHtml = '<ol>';
        currentTasks.forEach((zadatak) => {
            zadaciHtml += `<li>${zadatak.broj1} × ${zadatak.broj2} = _____</li>`;
        });
        zadaciHtml += '</ol>';
        printZadaci.html(zadaciHtml);
        
        // Prikaži modal
        $('#printModal').show();
    }

    // Event handleri
    $('#startTest').click(function() {
        isTestActive = true;
        score = 0;
        timeLeft = 300;
        $('#bodovi').text('0');
        $('#vrijeme').text('300');
        $('.test-info').show();
        $(this).hide();
        $('#generirajZadatke').hide();
        
        generirajZadatke();
        startTimer();
    });

    $('#generirajZadatke').click(generirajZadatke);

    // Event handleri za print modal
    $('#printButton').click(pripremiZaPrint);
    
    $('.close').click(function() {
        $('#printModal').hide();
    });
    
    $('#printNow').click(function() {
        window.print();
    });
    
    // Zatvori modal klikom izvan njega
    $(window).click(function(event) {
        if ($(event.target).is('#printModal')) {
            $('#printModal').hide();
        }
    });

    // Inicijalizacija
    generirajTablicu();
    generirajZadatke();
});
