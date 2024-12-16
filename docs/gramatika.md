# Implementacija hrvatske gramatike u JavaScript aplikacijama

## Pregled implementiranih gramatičkih pravila

### 1. Struktura složenih rečenica

#### Povezivanje rečenica:
- Korištenje prijelaznih riječi za bolju povezanost:
  - "nakon toga" - za vremenski slijed
  - "zatim" - za nabrajanje radnji
  - "od toga" - za dio cjeline
  - "tamo" - za prostorni kontekst

#### Redoslijed riječi:
```javascript
// Pravilno:
`${childName} je pojeo jabuku`  // subjekt-predikat-objekt
// Nepravilno:
`Jabuku je ${childName} pojeo`  // objekt-predikat-subjekt
```

#### Primjeri pravilne strukture:
1. Vremenski slijed:
   - "Marko je ubrao pet jabuka. Nakon toga je pojeo dvije jabuke."
   - "Ana je imala tri lopte. Zatim je izgubila jednu loptu."

2. Dio cjeline:
   - "U vreći su bila četiri kilograma brašna. Baka je od toga potrošila dva kilograma."
   - "Na grani su bile tri ptice. Od njih je odletjela jedna ptica."

3. Prostorni kontekst:
   - "Ivan je na izlet ponio četiri sendviča. Tamo je pojeo dva sendviča."

### 2. Slaganje brojeva s imenicama

#### Pravila za brojeve 2-4:
```javascript
// Primjer implementacije
const jeBilo = (broj >= 2 && broj <= 4) ? 'su bila' : 'je bilo';
// "U vreći su bila tri kilograma" vs "U vreći je bilo pet kilograma"
```

#### Deklinacija imenica uz brojeve:
- 1: nominativ jednine ("jedan sendvič")
- 2-4: genitiv jednine ("dva sendviča")
- 5+: genitiv množine ("pet sendviča")

### 3. Rod imenica i slaganje s glagolima

#### Određivanje roda imenice:
```javascript
function getNounGender(noun) {
    // Muški rod
    if (noun === 'sendvič' || noun === 'bombon' || noun === 'kilogram' || noun === 'balon') {
        return 'masculine';
    }
    // Ženski rod
    if (noun === 'ptica' || noun === 'jabuka' || noun === 'lopta' || 
        noun === 'sličica' || noun === 'čokolada' || noun === 'lizalica' || 
        noun === 'naranča') {
        return 'feminine';
    }
    // Srednji rod
    return 'neuter';
}
```

#### Slaganje glagola s rodom:
```javascript
function getVerbGenderForm(subject, masculine, feminine, neuter) {
    const gender = getNounGender(subject);
    switch(gender) {
        case 'masculine': return masculine;  // "pojeo"
        case 'feminine': return feminine;    // "pojela"
        case 'neuter': return neuter;       // "pojelo"
    }
}
```

### 4. Velika slova na početku rečenice

```javascript
// Pretvaranje prvog slova u veliko
const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
// "Jedna ptica je odletjela."
```

### 5. Pomoćni glagoli

#### Dodavanje pomoćnih glagola:
- "je" za treće lice jednine
- "su" za treće lice množine

```javascript
// Primjeri:
"${childName} je pojeo" // umjesto samo "pojeo"
"ptice su odletjele"    // umjesto samo "odletjele"
```

### 6. Implementirane imenice po rodu

#### Muški rod:
- sendvič
- bombon
- kilogram
- balon

#### Ženski rod:
- ptica
- jabuka
- lopta
- sličica
- čokolada
- lizalica
- naranča

### 7. Primjeri pravilnih rečenica

1. Brojevi 2-4:
   - "Na grani su bile tri ptice"
   - "U vreći su bila četiri kilograma"

2. Brojevi 5+:
   - "Na grani je bilo pet ptica"
   - "U vreći je bilo šest kilograma"

3. Slaganje glagola:
   - "Marko je pojeo dva sendviča"
   - "Ana je pojela dvije jabuke"

### 8. Pravila za složene zadatke

#### Struktura matematičkog zadatka:
1. Prva rečenica: početno stanje
   - Uvodi subjekt i količinu
   - Koristi glagole "imati", "ubrati", "ponijeti"
   - Primjer: "Marko je imao pet jabuka"

2. Druga rečenica: promjena stanja
   - Povezuje se s prvom rečenicom prijelaznom riječi
   - Opisuje promjenu količine
   - Primjer: "Nakon toga je pojeo dvije jabuke"

3. Pitanje:
   - Uvijek u formatu "Koliko [mu/joj] je [imenica u genitivu] ostalo?"
   - Rod zamjenice ovisi o subjektu
   - Primjer: "Koliko mu je jabuka ostalo?"

#### Primjeri potpunih zadataka:
```javascript
// Primjer 1
`Na grani su bile tri ptice. Od njih je odletjela jedna ptica.
Koliko je ptica sada na grani?`

// Primjer 2
`U vreći su bila četiri kilograma brašna. Baka je od toga potrošila dva kilograma.
Koliko je kilograma brašna ostalo u vreći?`

// Primjer 3
`Ana je imala pet lopti. Zatim je izgubila dvije lopte.
Koliko joj je lopti ostalo?`

## Kako implementirati u novoj aplikaciji

1. Kopirajte declension.js datoteku
2. Implementirajte getNounGender funkciju za nove imenice
3. Koristite getVerbGenderForm za slaganje glagola
4. Koristite getNumberWord za pravilno slaganje brojeva s imenicama

### Primjer implementacije za nove imenice:

```javascript
// Dodavanje novih imenica
function getNounGender(noun) {
    const masculine = ['sendvič', 'bombon', 'kilogram', 'balon', 'novaDodanaImenica'];
    const feminine = ['ptica', 'jabuka', 'lopta', 'novaDodanaImenica'];
    
    if (masculine.includes(noun)) return 'masculine';
    if (feminine.includes(noun)) return 'feminine';
    return 'neuter';
}
```

## Testiranje gramatike

1. Provjerite slaganje brojeva s imenicama
2. Provjerite rod imenica i slaganje s glagolima
3. Provjerite velika slova na početku rečenice
4. Provjerite pomoćne glagole

## Česti problemi i rješenja

1. Problem: Nepravilno slaganje brojeva
   Rješenje: Koristite getNumberWord funkciju

2. Problem: Pogrešan rod glagola
   Rješenje: Provjerite je li imenica dodana u getNounGender funkciju

3. Problem: Nedostaje pomoćni glagol
   Rješenje: Dodajte "je" ili "su" ovisno o broju

## Buduća proširenja

1. Dodavanje više padeža
2. Podrška za pridjeve
3. Automatsko prepoznavanje roda imenica
4. Podrška za nepravilne glagole

### 9. Pravila za imena

#### Prepoznavanje roda imena:
```javascript
function getNameGender(name) {
    // Muška imena najčešće završavaju na suglasnik
    if (name.match(/[bcčćdđfghjklmnprsštvzž]$/)) {
        return 'masculine';
    }
    // Ženska imena najčešće završavaju na -a
    if (name.endsWith('a')) {
        return 'feminine';
    }
    // Posebni slučajevi (imena na -o ili -e)
    if (name.match(/[oe]$/)) {
        // Ovdje treba posebna provjera jer mogu biti i muška i ženska
        return checkSpecialNames(name);
    }
}
```

#### Lista implementiranih imena:
1. Muška imena:
   - Marko, Ivan, David, Luka, Matej
   - Posebni slučajevi: Mateo, Bruno

2. Ženska imena:
   - Ana, Lucija, Sara, Maja, Nina
   - Posebni slučajevi: Mare, Mare

#### Slaganje s glagolima:
```javascript
// Primjeri pravilnog slaganja
"Marko je pojeo"   // muški rod
"Ana je pojela"    // ženski rod
"Mare je pojela"   // ženski rod unatoč završetku na -e
```

### 10. Česte greške i njihova ispravka

#### 1. Pogrešan redoslijed subjekta i objekta
❌ Nepravilno:
- "Dvije jabuke je Ana pojela"
- "Jedan sendvič je Marko izgubio"

✅ Pravilno:
- "Ana je pojela dvije jabuke"
- "Marko je izgubio jedan sendvič"

#### 2. Pogrešna upotreba brojeva
❌ Nepravilno:
- "dvije kilograma" (muški rod s ženskim brojem)
- "pet jabuka je pojela" (množina bez pomoćnog glagola)

✅ Pravilno:
- "dva kilograma" (muški rod s muškim brojem)
- "pojela je pet jabuka" (ispravan redoslijed s pomoćnim glagolom)

#### 3. Nedostatak povezanosti između rečenica
❌ Nepravilno:
- "Ana je imala pet jabuka. Dvije jabuke je pojela."
- "U vreći je bilo brašno. Baka je potrošila dio."

✅ Pravilno:
- "Ana je imala pet jabuka. Nakon toga je pojela dvije jabuke."
- "U vreći je bilo brašno. Od toga je baka potrošila dva kilograma."

### 11. Proširena lista glagola

#### Glagoli posjedovanja:
```javascript
const possessionVerbs = {
    imati: {
        masculine: 'imao',
        feminine: 'imala',
        neuter: 'imalo'
    },
    dobiti: {
        masculine: 'dobio',
        feminine: 'dobila',
        neuter: 'dobilo'
    }
};
```

#### Glagoli gubitka/trošenja:
```javascript
const lossVerbs = {
    izgubiti: {
        masculine: 'izgubio',
        feminine: 'izgubila',
        neuter: 'izgubilo'
    },
    potrošiti: {
        masculine: 'potrošio',
        feminine: 'potrošila',
        neuter: 'potrošilo'
    }
};
```

#### Glagoli konzumacije:
```javascript
const consumptionVerbs = {
    pojesti: {
        masculine: 'pojeo',
        feminine: 'pojela',
        neuter: 'pojelo'
    },
    popiti: {
        masculine: 'popio',
        feminine: 'popila',
        neuter: 'popilo'
    }
};
```

### 12. Padežna pravila

#### Genitiv množine:
1. Osnovni oblici:
   - jabuka → jabuka
   - ptica → ptica
   - lopta → lopti
   - bombon → bombona

2. Posebni slučajevi:
   - Nepostojano 'a': vrabac → vrabaca
   - Promjena osnove: dijete → djece

#### Pravila za brojeve:
1. Jedan/jedna/jedno:
   - Nominativ jednine
   - Slaže se u rodu s imenicom
   - "jedan sendvič", "jedna jabuka"

2. Dva/dvije/dva, tri, četiri:
   - Genitiv jednine
   - "dva sendviča", "dvije jabuke"
   - "tri ptice", "četiri lopte"

3. Pet i više:
   - Genitiv množine
   - "pet sendviča", "šest jabuka"
   - "sedam ptica", "osam lopti"

#### Primjeri u kontekstu:
```javascript
// Pravilna upotreba padeža s brojevima
`${childName} je imao jedan sendvič`  // nominativ jednine
`${childName} je imao dva sendviča`   // genitiv jednine
`${childName} je imao pet sendviča`   // genitiv množine

// Pravilna upotreba padeža u pitanjima
"Koliko mu je sendviča ostalo?"      // genitiv množine
"Koliko joj je jabuka ostalo?"       // genitiv množine
"Koliko je lopti izgubila?"          // genitiv množine
