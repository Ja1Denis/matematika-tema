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

    function generirajZadatke() {
        zadaciContainer.innerHTML = '';
        zadaci = [];
        brojTocnih = 0;
        brojNetocnih = 0;
        updateScore();

        for(let i = 0; i < 20; i++) {
            const broj1 = Math.floor(Math.random() * 50) + 1;
            const broj2 = Math.floor(Math.random() * 50) + 1;
            const rezultat = broj1 * broj2;

            zadaci.push({
                broj1,
                broj2,
                rezultat
            });

            const zadatakElement = document.createElement('div');
            zadatakElement.className = 'zadatak';
            zadatakElement.innerHTML = `
                ${broj1} × ${broj2} = <input type="number" class="odgovor" data-index="${i}">
            `;
            zadaciContainer.appendChild(zadatakElement);
        }
    }

    function provjeriOdgovore() {
        const odgovori = document.querySelectorAll('.odgovor');
        brojTocnih = 0;
        brojNetocnih = 0;

        odgovori.forEach((odgovor, index) => {
            const zadatak = zadaci[index];
            const uneseniOdgovor = parseInt(odgovor.value);

            if(uneseniOdgovor === zadatak.rezultat) {
                odgovor.parentElement.classList.remove('incorrect');
                odgovor.parentElement.classList.add('correct');
                brojTocnih++;
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
    });

    window.addEventListener('afterprint', function() {
        generirajZadatke();
    });
});
