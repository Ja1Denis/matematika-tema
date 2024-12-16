// Define provjeriZadatak in global scope
function provjeriZadatak(input) {
    if (typeof jQuery === 'undefined') return;
    const $ = jQuery;
    
    const index = parseInt(input.dataset.index);
    const zadatak = window.zadaci[index];
    const uneseniOdgovor = parseInt(input.value);
    const broj1 = parseInt(input.dataset.broj1);
    const broj2 = parseInt(input.dataset.broj2);

    if (!isNaN(uneseniOdgovor)) {
        const zadatakElement = input.closest('.zadatak');
        const zadatakContent = zadatakElement.querySelector('.zadatak-content');
        zadatakContent.classList.remove('correct', 'incorrect');
        zadatakContent.querySelector('.checkmark')?.remove();
        zadatakContent.querySelector('.crossmark')?.remove();

        if (uneseniOdgovor === zadatak.rezultat) {
            zadatakContent.classList.add('correct');
            zadatakContent.insertAdjacentHTML('beforeend', '<span class="checkmark">✓</span>');

            const tablicaCell = window.pronadiCelijuUTablici(broj1, broj2);
            if (tablicaCell) {
                tablicaCell.classList.add('correct-cell');
            }
            window.brojTocnih++;
        } else {
            zadatakContent.classList.add('incorrect');
            zadatakContent.insertAdjacentHTML('beforeend', '<span class="crossmark">✗</span>');
            window.brojNetocnih++;
            input.value = ''; // Clear the input field when answer is incorrect
            setTimeout(() => {
                input.focus(); // Return focus to the input field
            }, 100);
        }
        window.updateScore();
    }
}

jQuery(document).ready(function($) {
    const zadaciContainer = document.getElementById('zadaciContainer');
    const generirajButton = document.getElementById('generirajZadatke');
    const provjeriButton = document.getElementById('provjeriOdgovore');
    const brojTocnihElement = document.getElementById('brojTocnih');
    const brojNetocnihElement = document.getElementById('brojNetocnih');

    // Make these variables global
    window.zadaci = [];
    window.brojTocnih = 0;
    window.brojNetocnih = 0;

    function ukloniKvaciceIzTablice() {
        document.querySelectorAll('.tablica-container td').forEach(td => {
            td.classList.remove('correct-cell');
        });
    }

    function pronadiCelijuUTablici(broj1, broj2) {
        const redovi = document.querySelectorAll('.tablica-container tr');
        for (let i = 1; i < redovi.length; i++) {
            const prviStupac = redovi[i].querySelector('th').textContent;
            if (parseInt(prviStupac) === broj1) {
                const celije = redovi[i].querySelectorAll('td');
                return celije[broj2 - 1];
            }
        }
        return null;
    }
    window.pronadiCelijuUTablici = pronadiCelijuUTablici;

    function generirajZadatke() {
        zadaciContainer.innerHTML = '';
        window.zadaci = [];
        window.brojTocnih = 0;
        window.brojNetocnih = 0;
        window.updateScore();
        ukloniKvaciceIzTablice();

        const broj1 = 8;
        for(let i = 0; i < 10; i++) {
            const broj2 = Math.floor(Math.random() * 8) + 1;
            const rezultat = broj1 * broj2;

            window.zadaci.push({
                broj1,
                broj2,
                rezultat
            });

            const zadatakElement = document.createElement('div');
            zadatakElement.className = 'zadatak';
            zadatakElement.innerHTML = `
                <div class="zadatak-content">
                    ${broj1} × ${broj2} = <input type="number" class="odgovor" data-index="${i}" data-broj1="${broj1}" data-broj2="${broj2}">
                    <button class="provjeri-btn" onclick="provjeriZadatak(this.previousElementSibling)">Provjeri</button>
                </div>
            `;
            zadaciContainer.appendChild(zadatakElement);
        }

        document.querySelectorAll('.odgovor').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    provjeriZadatak(this);
                }
            });
        });
    }

    function provjeriOdgovore() {
        document.querySelectorAll('.odgovor').forEach(input => provjeriZadatak(input));
    }

    function updateScore() {
        brojTocnihElement.textContent = `Točnih odgovora: ${window.brojTocnih}`;
        brojNetocnihElement.textContent = `Netočnih odgovora: ${window.brojNetocnih}`;
    }
    window.updateScore = updateScore;

    generirajButton.addEventListener('click', generirajZadatke);
    provjeriButton.addEventListener('click', provjeriOdgovore);

    generirajZadatke();
});
