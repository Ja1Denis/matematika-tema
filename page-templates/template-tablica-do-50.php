<?php
/*
Template Name: Tablica Do 5
*/

get_header();

// Registracija i učitavanje CSS-a
wp_enqueue_style('tablica-mnozenja-5-style', get_template_directory_uri() . '/assets/css/tablica-mnozenja-5.css');

// Registracija i učitavanje JavaScript-a
wp_enqueue_script('jquery');
wp_enqueue_script('tablica-mnozenja-5-script', get_template_directory_uri() . '/assets/js/tablica-mnozenja-5.js', array('jquery'), '1.0', true);

// Uklanjamo registraciju nepotrebnih skripti
wp_dequeue_script('matematicka-igra');
?>

<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f2f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.container.tablica-mnozenja-5 {
    margin-top: 60px;
}

header {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
}

h1 {
    color: #1a73e8;
    margin-bottom: 20px;
}

.controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.controls button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.controls button:hover {
    background-color: #1557b0;
}

.controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.test-info {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: #fefefe;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    width: 90%;
    max-width: 500px;
    position: relative;
}

.close {
    position: absolute;
    right: 10px;
    top: 5px;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.zadaci-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin: 20px 0;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.zadatak {
    background-color: #fff;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    text-align: center;
    font-size: 18px;
    position: relative;
    transition: transform 0.2s;
}

.zadatak:hover {
    transform: scale(1.05);
}

.zadatak input {
    width: 60px;
    padding: 5px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-left: 5px;
}

.zadatak.correct {
    background-color: #e8f5e9;
}

.zadatak.incorrect {
    background-color: #ffebee;
}

.zadatak.correct::before {
    content: '✓';
    color: #4CAF50;
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: white;
    border-radius: 50%;
    padding: 2px;
    font-size: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.tablica-container {
    margin: 20px 0;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.tablica-container table {
    width: 100%;
    border-collapse: collapse;
}

.tablica-container th, .tablica-container td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.tablica-container th {
    background-color: #f0f2f5;
}

@media print {
    .controls, .test-info {
        display: none;
    }
    
    .zadaci-container {
        box-shadow: none;
    }
    
    .zadatak {
        box-shadow: none;
        border: 1px solid #ddd;
    }
    
    .zadatak input {
        border: none;
    }
}
</style>

<div class="container tablica-mnozenja-5">
    <header>
        <h1>Tablica množenja do 5</h1>
    </header>

    <div class="controls">
        <button id="generirajZadatke">Generiraj nove zadatke</button>
        <button id="provjeriOdgovore">Provjeri odgovore</button>
        <button id="prikaziRjesenja">Prikaži rješenja</button>
        <button onclick="window.print()">Ispiši zadatke</button>
    </div>

    <div class="test-info">
        <div id="brojTocnih">Točnih odgovora: 0</div>
        <div id="brojNetocnih">Netočnih odgovora: 0</div>
    </div>

    <div class="tablica-container">
        <table>
            <thead>
                <tr>
                    <th>×</th>
                    <?php for($i = 1; $i <= 5; $i++): ?>
                        <th><?php echo $i; ?></th>
                    <?php endfor; ?>
                </tr>
            </thead>
            <tbody>
                <?php for($i = 1; $i <= 5; $i++): ?>
                    <tr>
                        <th><?php echo $i; ?></th>
                        <?php for($j = 1; $j <= 5; $j++): ?>
                            <td><?php echo $i * $j; ?></td>
                        <?php endfor; ?>
                    </tr>
                <?php endfor; ?>
            </tbody>
        </table>
    </div>

    <div class="zadaci-container" id="zadaciContainer">
        <!-- Ovdje će JavaScript generirati zadatke -->
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
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

    generirajButton.addEventListener('click', generirajZadatke);
    provjeriButton.addEventListener('click', provjeriOdgovore);
    prikaziRjesenjaButton.addEventListener('click', prikaziRjesenja);

    // Generiranje početnih zadataka
    generirajZadatke();
});

// Funkcionalnost za ispis
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
</script>

<?php get_footer(); ?>
