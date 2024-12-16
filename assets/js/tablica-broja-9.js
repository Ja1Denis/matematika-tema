jQuery(document).ready(function($) {
    window.zadaci = [];
    window.brojTocnih = 0;
    window.brojNetocnih = 0;

    function generirajZadatke() {
        window.zadaci = [];
        window.brojTocnih = 0;
        window.brojNetocnih = 0;
        updateScore();

        // Clear all marked cells in the table
        const tableCells = document.querySelectorAll('.tablica-container table td');
        tableCells.forEach(cell => {
            cell.classList.remove('correct-cell');
            cell.querySelector('.cell-checkmark')?.remove();
        });

        const zadaciContainer = $('.zadaci-container');
        zadaciContainer.empty();

        for (let i = 0; i < 10; i++) {
            const broj1 = Math.floor(Math.random() * 9) + 1;
            const broj2 = 9;
            const rezultat = broj1 * broj2;

            window.zadaci.push({
                broj1: broj1,
                broj2: broj2,
                rezultat: rezultat
            });

            const zadatak = $(`
                <div class="zadatak">
                    <div class="zadatak-content">
                        <span>${broj1} × ${broj2} = </span>
                        <input type="number" data-index="${i}" data-broj1="${broj1}" data-broj2="${broj2}" />
                    </div>
                </div>
            `);

            zadaciContainer.append(zadatak);
        }

        // Add event listeners
        $('.zadatak input').on('keypress', function(e) {
            if (e.which === 13) {
                provjeriZadatak(this);
            }
        });
    }

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
                    // Add checkmark to table cell if it doesn't already have one
                    if (!tablicaCell.querySelector('.cell-checkmark')) {
                        tablicaCell.insertAdjacentHTML('beforeend', '<span class="cell-checkmark">✓</span>');
                    }
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

    window.pronadiCelijuUTablici = function(broj1, broj2) {
        const table = document.querySelector('.tablica-container table');
        const rows = table.querySelectorAll('tr');
        
        // Find the cell in the table
        for (let i = 1; i < rows.length; i++) {
            const firstCell = rows[i].querySelector('th');
            if (parseInt(firstCell.textContent) === broj1) {
                const cells = rows[i].querySelectorAll('td');
                return cells[broj2 - 1];
            }
        }
        return null;
    };

    window.updateScore = function() {
        $('#brojTocnih').text(`Točnih odgovora: ${window.brojTocnih}`);
        $('#brojNetocnih').text(`Netočnih odgovora: ${window.brojNetocnih}`);
    };

    // Event listeners
    $('#generirajZadatke').on('click', generirajZadatke);
    
    $('#provjeriOdgovore').on('click', function() {
        $('.zadatak input').each(function() {
            if (this.value !== '') {
                provjeriZadatak(this);
            }
        });
    });

    // Generate initial tasks
    generirajZadatke();
});
