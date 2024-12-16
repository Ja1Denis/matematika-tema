jQuery(document).ready(function($) {
    const zadaciContainer = document.getElementById('zadaciContainer');
    const generirajButton = document.getElementById('generirajZadatke');
    const provjeriButton = document.getElementById('provjeriOdgovore');
    const brojTocnihElement = document.getElementById('brojTocnih');
    const brojNetocnihElement = document.getElementById('brojNetocnih');

    let zadaci = [];
    let brojTocnih = 0;
    let brojNetocnih = 0;

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

    function provjeriZadatak(input) {
        const index = parseInt(input.dataset.index);
        const zadatak = zadaci[index];
        const uneseniOdgovor = parseInt(input.value);
        const broj1 = parseInt(input.dataset.broj1);
        const broj2 = parseInt(input.dataset.broj2);

        if (!isNaN(uneseniOdgovor)) {
            if (uneseniOdgovor === zadatak.rezultat) {
                input.parentElement.classList.remove('incorrect');
                input.parentElement.classList.add('correct');

                const tablicaCell = pronadiCelijuUTablici(broj1, broj2);
                if (tablicaCell) {
                    tablicaCell.classList.add('correct-cell');
                }
            } else {
                input.parentElement.classList.remove('correct');
                input.parentElement.classList.add('incorrect');
            }
            updateScore();
        }
    }

    function generirajZadatke() {
        zadaciContainer.innerHTML = '';
        zadaci = [];
        brojTocnih = 0;
        brojNetocnih = 0;
        updateScore();
        ukloniKvaciceIzTablice();

        const brojevi = [1, 2, 3, 4];
        for(let i = 0; i < 10; i++) {
            const broj1 = brojevi[Math.floor(Math.random() * brojevi.length)];
            const broj2 = Math.floor(Math.random() * 10) + 1;
            const rezultat = broj1 * broj2;

            zadaci.push({
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
        document.querySelectorAll('.odgovor').forEach(input => {
            provjeriZadatak(input);
        });
    }

    function updateScore() {
        const tocni = document.querySelectorAll('.zadatak.correct').length;
        const netocni = document.querySelectorAll('.zadatak.incorrect').length;
        brojTocnihElement.textContent = `Točnih odgovora: ${tocni}`;
        brojNetocnihElement.textContent = `Netočnih odgovora: ${netocni}`;
    }

    generirajButton.addEventListener('click', generirajZadatke);
    provjeriButton.addEventListener('click', provjeriOdgovore);

    generirajZadatke();

    window.addEventListener('beforeprint', function() {
        const zadaci = document.querySelectorAll('.zadatak');
        zadaci.forEach(zadatak => {
            const zadatakContent = zadatak.querySelector('.zadatak-content');
            const tekst = zadatakContent.textContent.split('=')[0].trim();
            zadatakContent.innerHTML = tekst;
        });
        ukloniKvaciceIzTablice();
    });

    window.addEventListener('afterprint', function() {
        generirajZadatke();
    });
});
