jQuery(document).ready(function($) {
    const BROJ = 3;
    const VRIJEME_TESTA = 300;
    let preostaloVrijeme = VRIJEME_TESTA;
    let timerInterval;
    let zadaci = [];
    let trenutniZadatak = 0;
    let bodovi = 0;
    let testMode = false;

    // Print Modal elementi
    const modal = document.getElementById('printModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const printBtn = document.getElementById('printNow');

    // Generiranje tablice množenja
    function generirajTablicu(container = 'tablicaMnozenja') {
        const tablica = document.getElementById(container);
        tablica.innerHTML = '';

        // Zaglavlje
        const headerRow = document.createElement('tr');
        for (let i = 0; i <= 10; i++) {
            const th = document.createElement('th');
            th.textContent = i === 0 ? '×' : i;
            headerRow.appendChild(th);
        }
        tablica.appendChild(headerRow);

        // Red za broj 3
        const row = document.createElement('tr');
        const thRow = document.createElement('th');
        thRow.textContent = BROJ;
        row.appendChild(thRow);

        for (let j = 1; j <= 10; j++) {
            const td = document.createElement('td');
            td.textContent = BROJ * j;
            td.dataset.broj1 = BROJ;
            td.dataset.broj2 = j;
            if (container === 'tablicaMnozenja') {
                td.addEventListener('mouseover', () => highlightCell(td));
                td.addEventListener('mouseout', () => removeHighlight(td));
                td.addEventListener('click', () => showMultiplication(BROJ, j));
            }
            row.appendChild(td);
        }
        tablica.appendChild(row);
    }

    // Označavanje ćelija
    function highlightCell(cell) {
        cell.classList.add('highlight');
    }

    function removeHighlight(cell) {
        cell.classList.remove('highlight');
    }

    function showMultiplication(broj1, broj2) {
        const rezultat = broj1 * broj2;
        alert(`${broj1} × ${broj2} = ${rezultat}`);
    }

    // Generiranje zadataka
    function generirajZadatke(container = 'zadaci', forPrint = false) {
        const zadaciDiv = document.getElementById(container);
        zadaciDiv.innerHTML = '';
        if (!forPrint) {
            zadaci = [];
            trenutniZadatak = 0;
            bodovi = 0;
            updateBodovi();
        }

        // Kreiranje niza brojeva 1-10
        let brojevi = Array.from({length: 10}, (_, i) => i + 1);
        shuffleArray(brojevi);

        // Uzimanje prvih 10 brojeva za zadatke
        for (let i = 0; i < 10; i++) {
            const zadatak = {
                broj1: BROJ,
                broj2: brojevi[i],
                rezultat: BROJ * brojevi[i]
            };
            if (!forPrint) {
                zadaci.push(zadatak);
            }

            const zadatakDiv = document.createElement('div');
            zadatakDiv.className = 'zadatak';
            
            const zadatakText = document.createElement('span');
            zadatakText.textContent = `${zadatak.broj1} × ${zadatak.broj2} = `;
            zadatakDiv.appendChild(zadatakText);
            
            if (!forPrint) {
                const input = document.createElement('input');
                input.type = 'number';
                input.id = `odgovor${i}`;
                input.min = '0';
                input.max = '100';
                zadatakDiv.appendChild(input);
                
                const button = document.createElement('button');
                button.textContent = 'Provjeri';
                button.onclick = () => provjeriOdgovor(i, parseInt(input.value));
                zadatakDiv.appendChild(button);

                input.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        provjeriOdgovor(i, parseInt(input.value));
                    }
                });
            } else {
                const linija = document.createElement('span');
                linija.textContent = '______';
                linija.style.marginLeft = '10px';
                zadatakDiv.appendChild(linija);
            }

            zadaciDiv.appendChild(zadatakDiv);
        }
    }

    // Print Modal funkcionalnost
    function pripremaPrintPreview() {
        // Generiraj tablicu za print
        const printTablicaDiv = document.getElementById('printTablica');
        const tablica = document.createElement('table');
        tablica.id = 'printTablicaEl';
        printTablicaDiv.innerHTML = '';
        printTablicaDiv.appendChild(tablica);
        generirajTablicu('printTablicaEl');

        // Generiraj zadatke za print
        generirajZadatke('printZadaci', true);

        modal.style.display = 'block';
    }

    // Event handleri za modal
    $('#printButton').on('click', pripremaPrintPreview);
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    printBtn.onclick = function() {
        window.print();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Provjera odgovora
    function provjeriOdgovor(index, odgovor) {
        if (isNaN(odgovor)) return;

        const zadatak = zadaci[index];
        const zadatakDiv = document.querySelectorAll('.zadatak')[index];
        const input = zadatakDiv.querySelector('input');
        const button = zadatakDiv.querySelector('button');

        // Ukloni postojeću kvačicu ako postoji
        const postojecaKvacica = zadatakDiv.querySelector('.checkmark');
        if (postojecaKvacica) {
            postojecaKvacica.remove();
        }

        if (odgovor === zadatak.rezultat) {
            zadatakDiv.classList.remove('incorrect');
            zadatakDiv.classList.add('correct');
            
            if (!zadatakDiv.classList.contains('rijeseno')) {
                bodovi++;
                zadatakDiv.classList.add('rijeseno');
                
                // Dodaj novu kvačicu u zadatku
                const checkmark = document.createElement('span');
                checkmark.className = 'checkmark';
                checkmark.innerHTML = '✓';
                zadatakDiv.appendChild(checkmark);
                
                // Dodaj kvačicu u tablici
                const tablicaCell = document.querySelector(`.tablica-mnozenja-30 td[data-broj1="${zadatak.broj1}"][data-broj2="${zadatak.broj2}"]`);
                if (tablicaCell) {
                    tablicaCell.classList.add('correct');
                }
                
                updateBodovi();
                
                // Onemogući input i gumb nakon točnog odgovora
                input.disabled = true;
                button.disabled = true;
            }
        } else {
            zadatakDiv.classList.remove('correct');
            zadatakDiv.classList.add('incorrect');
            
            // Dodaj animaciju trešnje za netočan odgovor
            zadatakDiv.style.animation = 'shake 0.5s';
            setTimeout(() => {
                zadatakDiv.style.animation = '';
            }, 500);
        }

        if (testMode && bodovi === 10) {
            zavrsiTest();
        }
    }

    function updateBodovi() {
        const boroviElement = document.getElementById('bodovi');
        if (boroviElement) {
            boroviElement.textContent = bodovi;
        }
    }

    // Miješanje niza
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Test mod
    function startTest() {
        testMode = true;
        preostaloVrijeme = VRIJEME_TESTA;
        bodovi = 0;
        updateBodovi();
        $('.test-info').css('display', 'flex');
        generirajZadatke();
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            preostaloVrijeme--;
            $('#vrijeme').text(preostaloVrijeme);
            
            if (preostaloVrijeme <= 30) {
                $('#vrijeme').css('color', 'red');
            }
            
            if (preostaloVrijeme <= 0) {
                zavrsiTest();
            }
        }, 1000);
    }

    function zavrsiTest() {
        clearInterval(timerInterval);
        testMode = false;
        $('.test-info').css('display', 'none');
        
        // Ukloni sve kvačice iz tablice
        document.querySelectorAll('.tablica-mnozenja-30 td.correct').forEach(cell => {
            cell.classList.remove('correct');
        });
        
        const postotak = (bodovi / 10) * 100;
        let ocjena = 1;
        
        if (postotak >= 90) ocjena = 5;
        else if (postotak >= 80) ocjena = 4;
        else if (postotak >= 65) ocjena = 3;
        else if (postotak >= 50) ocjena = 2;
        
        alert(`Test je završen!\nBodovi: ${bodovi}/10\nPostotak: ${postotak}%\nOcjena: ${ocjena}`);
        
        // Resetiraj boju vremena
        $('#vrijeme').css('color', '');
    }

    // Event listeneri
    $('#generirajZadatke').on('click', () => generirajZadatke());
    $('#startTest').on('click', startTest);

    // Dodaj CSS animaciju za trešnju
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Inicijalno generiranje tablice i zadataka
    generirajTablicu();
    generirajZadatke();
});
