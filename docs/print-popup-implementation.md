# Print Popup Implementation Guide

## Overview
Implementacija print popup-a za generiranje zadataka za ispis, koja se može koristiti kao predložak za druge aplikacije.

## Ključne komponente

### 1. HTML struktura
```html
<!-- Print Modal -->
<div id="printModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Zadaci za ispis</h2>
        <ol id="printTaskList"></ol>
        <button onclick="window.print()">Ispiši</button>
    </div>
</div>
```

### 2. CSS stilovi
```css
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
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
}

/* Print-specific stilovi */
@media print {
    body * {
        visibility: hidden;
    }
    #printTaskList, #printTaskList * {
        visibility: visible;
    }
    #printTaskList {
        position: absolute;
        left: 0;
        top: 0;
    }
}
```

### 3. JavaScript funkcionalnost
```javascript
// Funkcija za generiranje pregleda za ispis
function generatePrintPreview() {
    const taskList = [];
    // Generiraj nekoliko zadataka
    for (let i = 0; i < 5; i++) {
        const task = generateTask();
        taskList.push(`<li>${task.text} (Odgovor: ${task.answer})</li>`);
    }
    $('#printTaskList').html(taskList.join(''));
}

// Event handleri za modal
const modal = document.getElementById('printModal');
const closeBtn = document.getElementsByClassName('close')[0];

// Otvori modal
document.getElementById('printButton').onclick = function() {
    modal.style.display = 'block';
    generatePrintPreview();
}

// Zatvori modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Zatvori modal klikom izvan njega
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
```

## Prednosti ovog pristupa

1. **Odvajanje sadržaja za ispis**
   - Sadržaj za ispis je odvojen od glavnog sučelja
   - Korisnik može pregledati što će biti ispisano prije ispisa

2. **Fleksibilnost**
   - Lako se može prilagoditi za različite vrste sadržaja
   - Moguće je dodati opcije za prilagodbu ispisa (broj zadataka, težina, itd.)

3. **Poboljšano korisničko iskustvo**
   - Pregled prije ispisa
   - Mogućnost odustajanja od ispisa
   - Jasno odvojen sadržaj za ispis

## Primjene u drugim aplikacijama

1. **Kvizovi i testovi**
   - Generiranje testova za ispis
   - Ispis s ili bez rješenja

2. **Matematičke vježbe**
   - Tablice množenja
   - Zadaci s razlomcima
   - Geometrijski zadaci

3. **Jezične vježbe**
   - Vježbe pravopisa
   - Gramatički zadaci
   - Vježbe vokabulara

4. **Glazbene vježbe**
   - Notni zapisi
   - Ritamske vježbe

## Moguća proširenja

1. **Opcije prilagodbe**
   - Broj zadataka
   - Težina zadataka
   - Format ispisa (veličina fonta, razmak između zadataka)

2. **Dodatne funkcionalnosti**
   - Spremanje u PDF
   - Dijeljenje putem e-maila
   - Spremanje generiranih zadataka

3. **Napredne opcije ispisa**
   - Više stranica
   - Različiti formati papira
   - Zaglavlje i podnožje

## Implementacijske napomene

1. **Responzivnost**
   - Modal treba biti responzivan
   - Sadržaj se treba prilagoditi različitim veličinama ekrana

2. **Pristupačnost**
   - Dodati ARIA oznake
   - Osigurati navigaciju tipkovnicom
   - Osigurati čitljivost za screen readere

3. **Performanse**
   - Generirati zadatke asinkrono ako ih je mnogo
   - Optimizirati DOM manipulacije
   - Koristiti učinkovite CSS selektore za print media query
