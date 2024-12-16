<?php
/*
Template Name: Tablica Do 40
*/

get_header();

// Registracija i učitavanje CSS-a
wp_enqueue_style('tablica-mnozenja-40-style', get_template_directory_uri() . '/assets/css/tablica-mnozenja-40.css');

// Registracija i učitavanje JavaScript-a
wp_enqueue_script('jquery');
wp_enqueue_script('tablica-mnozenja-40-script', get_template_directory_uri() . '/assets/js/tablica-mnozenja-40.js', array('jquery'), '1.0', true);

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

.container.tablica-mnozenja-40 {
    margin-top: 60px; /* Dodajte dovoljno prostora za admin bar */
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

/* Modal stilovi */
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
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    margin-top: -30vh; /* Povećano sa -10vh na -30vh da bude više na ekranu */
}

.print-area {
    margin: 15px 0;
}

.print-area h3 {
    font-size: 16px;
    margin: 15px 0 10px;
    color: #333;
}

.close {
    position: absolute;
    right: 15px;
    top: 10px;
    color: #666;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.2s;
}

.close:hover {
    color: #333;
}

.print-controls {
    margin-top: 20px;
    text-align: center;
}

/* Print-specific stilovi */
@media print {
    body * {
        visibility: hidden;
    }
    
    .print-content, .print-content * {
        visibility: visible;
    }
    
    .print-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
    
    .controls, button {
        display: none !important;
    }
}

/* Stilovi za tablicu množenja */
.tablica-container {
    overflow-x: auto;
    margin: 30px 0;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
    border-collapse: separate;
    border-spacing: 2px;
    margin: 0 auto;
    background: white;
}

th, td {
    padding: 15px 25px;
    text-align: center;
    font-size: 18px;
    border-radius: 4px;
}

th {
    background-color: #1a73e8;
    color: white;
    font-weight: bold;
}

td {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    transition: background-color 0.2s;
}

td:hover {
    background-color: #e8f0fe;
}

/* Stilovi za zadatke */
.zadaci-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.zadatak {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.zadatak input {
    width: 80px;
    padding: 8px;
    font-size: 16px;
    border: 2px solid #dee2e6;
    border-radius: 4px;
    text-align: center;
}

.zadatak input:focus {
    border-color: #1a73e8;
    outline: none;
}

.zadatak input:disabled {
    background-color: #f8f9fa;
    border-color: #ccc;
}

.zadatak.correct input {
    border-color: #4CAF50;
    background-color: #f0fff0;
}

.zadatak.incorrect input {
    border-color: #dc3545;
    background-color: #fff0f0;
}

/* Stilovi za tipku Provjeri */
.provjeri-btn {
    padding: 8px 15px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.provjeri-btn:hover {
    background-color: #1557b0;
}

.provjeri-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Stilovi za vizualne indikatore */
td.correct {
    position: relative;
}

td.correct::after {
    content: '✓';
    position: absolute;
    top: 5px;
    right: 5px;
    color: #4CAF50;
    font-size: 12px;
    font-weight: bold;
}

.zadatak.correct::before {
    content: '✓';
    color: #4CAF50;
    margin-right: 10px;
    font-size: 16px;
    font-weight: bold;
}

.zadatak.incorrect::before {
    content: '✗';
    color: #dc3545;
    margin-right: 10px;
    font-size: 16px;
    font-weight: bold;
}

/* Responzivni dizajn */
@media (max-width: 768px) {
    th, td {
        padding: 12px 20px;
        font-size: 16px;
    }
    
    .zadatak {
        flex-direction: column;
        text-align: center;
    }
}

/* Print section styles */
.print-section {
    display: none;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    max-width: 800px;
}

.print-section.show {
    display: block !important;
}

.print-controls {
    text-align: center;
    margin: 20px 0;
}

@media print {
    body * {
        visibility: hidden;
    }
    .print-content, .print-content * {
        visibility: visible;
    }
    .print-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
    }
    
    .controls, button {
        display: none !important;
    }

    .zadaci-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
    }

    .zadatak {
        margin: 0;
        padding: 5px;
    }
}

.print-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}
</style>

<div class="container tablica-mnozenja-40">
    <header>
        <h1><?php the_title(); ?></h1>
        <div class="controls">
            <button id="startTest">Započni Test</button>
            <button id="generirajZadatke">Generiraj Nove Zadatke</button>
            <button onclick="window.print()">Ispiši</button>
        </div>
    </header>

    <main>
        <div class="print-content">
            <div class="tablica-container">
                <h2>Tablica Množenja</h2>
                <table id="tablicaMnozenja40">
                    <!-- Tablica će biti generirana kroz JavaScript -->
                </table>
            </div>
            
            <div class="zadaci">
                <h2>Zadaci za vježbu</h2>
                <div id="zadaci" class="zadaci-grid"></div>
            </div>
        </div>
    </main>
</div>

<script>
const BROJ = 4;
let zadaci = [];

// Generiranje tablice množenja
function generirajTablicu() {
    const tablica = document.getElementById('tablicaMnozenja40');
    tablica.innerHTML = '';
    
    for(let i = 1; i <= 10; i++) {
        const red = document.createElement('tr');
        const zadatak = document.createElement('td');
        const rezultat = document.createElement('td');
        
        zadatak.textContent = `${BROJ} × ${i} =`;
        rezultat.textContent = BROJ * i;
        
        red.appendChild(zadatak);
        red.appendChild(rezultat);
        tablica.appendChild(red);
    }
}

// Generiranje zadataka
function generirajZadatke() {
    zadaci = [];
    for(let i = 0; i < 10; i++) {
        const broj = Math.floor(Math.random() * 10) + 1;
        zadaci.push({
            broj: broj,
            rezultat: BROJ * broj
        });
    }
    prikaziZadatke();
}

// Prikazivanje zadataka
function prikaziZadatke() {
    const zadaciContainer = document.getElementById('zadaci');
    zadaciContainer.innerHTML = '';
    zadaci.forEach((zadatak, index) => {
        const div = document.createElement('div');
        div.className = 'zadatak';
        // Dodajemo klasu za print
        if (window.matchMedia('print').matches) {
            div.innerHTML = `${BROJ} × ${zadatak.broj} = _____`;
        } else {
            div.innerHTML = `${BROJ} × ${zadatak.broj} = <input type="number" class="odgovor">`;
        }
        zadaciContainer.appendChild(div);
    });
}

// Funkcija za provjeru odgovora
function startTest() {
    const inputs = document.querySelectorAll('.zadatak input');
    let tocnih = 0;

    inputs.forEach((input, index) => {
        const tocanOdgovor = zadaci[index].rezultat;
        const korisnikovOdgovor = parseInt(input.value);

        if (korisnikovOdgovor === tocanOdgovor) {
            input.style.backgroundColor = '#90EE90'; // zelena za točan odgovor
            tocnih++;
        } else {
            input.style.backgroundColor = '#FFB6C1'; // crvena za netočan odgovor
        }
    });

    // Prikaži rezultat
    alert(`Točno ste riješili ${tocnih} od ${zadaci.length} zadataka!`);
}

// Event listeneri
document.getElementById('generirajZadatke').addEventListener('click', generirajZadatke);
document.getElementById('startTest').addEventListener('click', startTest);

// Dodajemo event listener za print
window.addEventListener('beforeprint', function() {
    const zadaci = document.querySelectorAll('.zadatak');
    zadaci.forEach(zadatak => {
        const tekst = zadatak.textContent.split('=')[0];
        zadatak.innerHTML = `${tekst}= _____`;
    });
});

// Inicijalno generiranje tablice i zadataka
document.addEventListener('DOMContentLoaded', function() {
    generirajTablicu();
    generirajZadatke();
});
</script>

<?php get_footer(); ?>
