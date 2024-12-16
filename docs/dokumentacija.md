# MatematikaPRO - Dokumentacija

## 📋 Pregled Projekta

### Osnovne Informacije
- **Naziv**: Zadaci Riječima Do 20
- **Verzija**: 1.0.0
- **Platforma**: WordPress
- **Jezik**: Hrvatski
- **Tehnologije**: JavaScript, jQuery, PHP

### Opis
Interaktivna edukativna aplikacija za vježbanje matematičkih zadataka riječima na hrvatskom jeziku, prilagođena za djecu osnovnoškolskog uzrasta.

## 🎯 Funkcionalnosti

### Generiranje Zadataka
- Dinamičko generiranje zadataka riječima
- Gramatički ispravne rečenice na hrvatskom jeziku
- Prilagođena težina za dob učenika
- Različiti tipovi zadataka:
  - Ptice na grani
  - Bomboni
  - Brašno
  - Sendviči
  - Jabuke
  - Lopte

### Jezične Funkcije
1. **Deklinacija imenica**
   ```javascript
   declineNounByNumber(number, noun)
   ```
   - Podržava jedninu i množinu
   - Pravilna deklinacija prema broju
   - Podrška za različite padeže

2. **Brojevi riječima**
   ```javascript
   getNumberWord(number, noun)
   ```
   - Konverzija brojeva u riječi
   - Slaganje s imenicama
   - Podrška za rod imenice

3. **Glagolski oblici**
   ```javascript
   getVerbGenderForm(subject, maleForm, femaleForm, neutralForm)
   ```
   - Slaganje glagola u rodu
   - Podrška za sva tri roda
   - Kontekstualno slaganje

## 🛠️ Tehnička Implementacija

### Struktura Direktorija
```
matematika-tema/
├── assets/
│   ├── js/
│   │   ├── declension.js
│   │   ├── tasks.js
│   │   └── script.js
│   └── css/
│       └── zadaci-rijecima.css
├── page-templates/
│   └── template-zadaci-rijecima.php
└── docs/
    └── dokumentacija.md
```

### Ključne Komponente

#### 1. declension.js
- Upravlja deklinacijom imenica i brojeva
- Sadrži logiku za gramatičku točnost
- Implementira funkcije za slaganje riječi

#### 2. tasks.js
- Definira predloške zadataka
- Implementira generiranje zadataka
- Upravlja bodovanjem i provjerom

#### 3. template-zadaci-rijecima.php
- WordPress predložak stranice
- Implementira korisničko sučelje
- Upravlja ispisom zadataka

## 🖨️ Print Funkcionalnost

### Implementacija Print Popupa
1. **HTML Struktura**
   ```html
   <div id="printPreview" class="print-preview">
       <div class="print-preview-content">
           <div class="print-preview-header">
               <h2>Zadaci Riječima Do 20</h2>
               <div class="print-preview-controls">
                   <button id="doPrint">Ispiši</button>
                   <button id="closePreview">Zatvori</button>
               </div>
           </div>
           <div id="printTaskList"></div>
       </div>
   </div>
   ```

2. **CSS Stilovi**
   ```css
   @media print {
       body * {
           visibility: hidden;
       }
       #printPreview * {
           visibility: visible;
       }
       #printPreview {
           position: absolute;
           left: 0;
           top: 0;
       }
   }
   ```

3. **JavaScript Funkcionalnost**
   ```javascript
   function preparePrintPreview() {
       const taskList = generateMultipleTasks(10);
       displayTasksForPrint(taskList);
   }
   ```

## 🔒 Gramatika i Jezične Funkcije

### Deklinacija po Padežima
1. **Nominativ**
   - Osnovna riječ
   - Koristi se za subjekt

2. **Genitiv**
   - Označava pripadnost
   - Koristi se uz brojeve 2-4

3. **Implementacija**
   ```javascript
   const CASES = {
       NOMINATIVE: 'nominative',
       GENITIVE: 'genitive'
   };
   ```

### Slaganje s Brojevima
1. **Jednina** (1)
   - Nominativ jednine
   - Glagol u jednini

2. **Množina** (2-4)
   - Genitiv jednine
   - Glagol u množini

3. **Množina** (5+)
   - Genitiv množine
   - Glagol u množini

## 🌐 Online Postavljanje

### Priprema za Produkciju
1. **Backup**
   - [ ] Napraviti kopiju teme
   - [ ] Izvesti bazu podataka
   - [ ] Spremiti media datoteke

2. **Optimizacija**
   - [ ] Minificirati JS datoteke
   - [ ] Minificirati CSS datoteke
   - [ ] Optimizirati slike

### WordPress Konfiguracija
```php
// wp-config.php
define('WP_DEBUG', false);
define('FORCE_SSL_ADMIN', true);
define('WP_CACHE', true);
```

### Apache Konfiguracija
```apache
# .htaccess
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

# GZIP Kompresija
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript
</IfModule>
```

## 📱 Responzivni Dizajn

### Media Queries
```css
/* Mobile */
@media screen and (max-width: 480px) {
    .container {
        width: 95%;
        padding: 1rem;
    }
    
    .controls {
        flex-direction: column;
        gap: 1rem;
    }
    
    .button {
        width: 100%;
    }
}

/* Tablet */
@media screen and (max-width: 768px) {
    .task-container {
        padding: 1.5rem;
    }
}

/* Print */
@media print {
    .controls,
    .input-container {
        display: none;
    }
    
    .print-preview {
        position: static;
        background: none;
    }
}
```

## 🔄 Održavanje

### Redovno Održavanje
- WordPress ažuriranja
- Backup procedure
- Performance monitoring
- Sigurnosne provjere

### Dokumentacija Promjena
- Verzioniranje koda
- Changelog održavanje
- Dokumentacija bugova

## 📚 Dodatni Resursi

### Korisni Linkovi
- [WordPress Codex](https://codex.wordpress.org/)
- [WordPress Security Guide](https://wordpress.org/support/article/hardening-wordpress/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

### Kontakt
- **Autor**: Siniša Denić
- **Email**: sinisa.denic@gmail.com
- **GitHub**: github.com/sinisadenic

---

*Zadnje ažuriranje: 13.12.2023.*
