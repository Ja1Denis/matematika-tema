jQuery(document).ready(function($) {
    const zadaciContainer = document.getElementById('zadaciContainer');
    const generirajButton = document.getElementById('generirajZadatke');
    const provjeriButton = document.getElementById('provjeriOdgovore');
    const prikaziRjesenjaButton = document.getElementById('prikaziRjesenja');
    const brojTocnihElement = document.getElementById('brojTocnih');
    const brojNetocnihElement = document.getElementById('brojNetocnih');

    let zadaci = [];
    let brojTocnih = 0;
    let brojNetocnih = 0;

    // Funkcija za uklanjanje svih kvačica iz tablice
    function ukloniKvaciceIzTablice() {
        document.querySelectorAll('.tablica-container td').forEach(td => {
            td.classList.remove('correct-cell');
        });
    }

    // Funkcija za pronalaženje ćelije u tablici
    function pronadiCelijuUTablici(broj1, broj2) {
        const redovi = document.querySelectorAll('.tablica-container tbody tr');
        if (redovi && redovi[broj1 - 1]) {
            const celije = redovi[broj1 - 1].querySelectorAll('td');
            if (celije && celije[broj2 - 1]) {
                return celije[broj2 - 1];
            }
        }
        return null;
    }

    function generirajZadatke() {
        zadaciContainer.innerHTML = '';
        zadaci = [];
        brojTocnih = 0;
        brojNetocnih = 0;
        updateScore();
        ukloniKvaciceIzTablice();

        for(let i = 0; i < 10; i++) {
            const broj1 = Math.floor(Math.random() * 5) + 1;
            const broj2 = Math.floor(Math.random() * 5) + 1;
            const rezultat = broj1 * broj2;

            zadaci.push({
                broj1,
                broj2,
                rezultat
            });

            const zadatakElement = document.createElement('div');
            zadatakElement.className = 'zadatak';
            zadatakElement.innerHTML = `
                ${broj1} × ${broj2} = <input type="number" class="odgovor" data-index="${i}" data-broj1="${broj1}" data-broj2="${broj2}">
            `;
            zadaciContainer.appendChild(zadatakElement);
        }

        // Dodaj event listener za Enter tipku na input poljima
        document.querySelectorAll('.odgovor').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    provjeriOdgovore();
                }
            });
        });
    }

    function provjeriOdgovore() {
        const odgovori = document.querySelectorAll('.odgovor');
        brojTocnih = 0;
        brojNetocnih = 0;
        ukloniKvaciceIzTablice();

        odgovori.forEach((odgovor, index) => {
            const zadatak = zadaci[index];
            const uneseniOdgovor = parseInt(odgovor.value);

            if(uneseniOdgovor === zadatak.rezultat) {
                odgovor.parentElement.classList.remove('incorrect');
                odgovor.parentElement.classList.add('correct');
                brojTocnih++;

                // Dodaj kvačicu u tablicu
                const broj1 = parseInt(odgovor.dataset.broj1);
                const broj2 = parseInt(odgovor.dataset.broj2);
                const tablicaCell = pronadiCelijuUTablici(broj1, broj2);
                
                if (tablicaCell) {
                    console.log('Pronađena ćelija:', tablicaCell);
                    tablicaCell.classList.add('correct-cell');
                }
            } else {
                odgovor.parentElement.classList.remove('correct');
                odgovor.parentElement.classList.add('incorrect');
                brojNetocnih++;
            }
        });

        updateScore();
    }

    function prikaziRjesenja() {
        const odgovori = document.querySelectorAll('.odgovor');
        odgovori.forEach((odgovor, index) => {
            odgovor.value = zadaci[index].rezultat;
            odgovor.parentElement.classList.remove('incorrect');
            odgovor.parentElement.classList.add('correct');

            // Dodaj kvačicu u tablicu za svaki točan odgovor
            const broj1 = parseInt(odgovor.dataset.broj1);
            const broj2 = parseInt(odgovor.dataset.broj2);
            const tablicaCell = pronadiCelijuUTablici(broj1, broj2);
            
            if (tablicaCell) {
                tablicaCell.classList.add('correct-cell');
            }
        });
        brojTocnih = zadaci.length;
        brojNetocnih = 0;
        updateScore();
    }

    function updateScore() {
        brojTocnihElement.textContent = `Točnih odgovora: ${brojTocnih}`;
        brojNetocnihElement.textContent = `Netočnih odgovora: ${brojNetocnih}`;
    }

    // Event listeneri
    generirajButton.addEventListener('click', generirajZadatke);
    provjeriButton.addEventListener('click', provjeriOdgovore);
    prikaziRjesenjaButton.addEventListener('click', prikaziRjesenja);

    // Generiranje početnih zadataka
    generirajZadatke();

    // Print funkcionalnost
    window.addEventListener('beforeprint', function() {
        const zadaci = document.querySelectorAll('.zadatak');
        zadaci.forEach(zadatak => {
            const tekst = zadatak.textContent.split('=')[0];
            zadatak.innerHTML = `${tekst}= _____`;
        });
        ukloniKvaciceIzTablice();
    });

    window.addEventListener('afterprint', function() {
        generirajZadatke();
    });
});
