/**
 * Hrvatska jezična podrška za tablicu množenja
 */

const HrvatskiJezik = {
    // Funkcija za deklinaciju brojeva
    brojRijecima: function(broj) {
        const jedinice = ['', 'jedan', 'dva', 'tri', 'četiri', 'pet', 'šest', 'sedam', 'osam', 'devet', 'deset'];
        return jedinice[broj];
    },

    // Funkcija za slaganje broja s imenicom
    slaganjeSBrojem: function(broj, imenica) {
        if (broj === 1) {
            return `${this.brojRijecima(broj)} ${imenica}`; // jedan zadatak
        } else if (broj >= 2 && broj <= 4) {
            return `${this.brojRijecima(broj)} ${imenica}a`; // dva/tri/četiri zadatka
        } else {
            return `${broj} ${imenica}aka`; // 5+ zadataka
        }
    },

    // Generiranje tekstualnih zadataka
    generirajTekstZadatka: function(broj1, broj2) {
        const predlošci = [
            (a, b) => `Marko ima ${this.slaganjeSBrojem(a, 'bombon')}. Ana ima ${b} puta više. Koliko bombona ima Ana?`,
            (a, b) => `U košari je ${this.slaganjeSBrojem(a, 'jabuk')}. Svaki dan pojedemo ${b} jabuka. Koliko dana možemo jesti jabuke?`,
            (a, b) => `Na grani je bilo ${this.slaganjeSBrojem(a, 'ptic')}. Došlo je još ${b} puta toliko ptica. Koliko je sada ptica na grani?`,
            (a, b) => `U razredu je ${this.slaganjeSBrojem(a, 'učenik')}. Svaki učenik treba dobiti ${b} olovaka. Koliko olovaka treba kupiti?`,
            (a, b) => `Maja ima ${this.slaganjeSBrojem(a, 'sličic')}. Želi ih rasporediti u ${b} jednakih stupaca. Koliko sličica ide u svaki stupac?`
        ];

        // Nasumično odaberi predložak
        const predložak = predlošci[Math.floor(Math.random() * predlošci.length)];
        return predložak(broj1, broj2);
    },

    // Generiranje povratne informacije
    povratnaInformacija: function(točno, ukupno) {
        const postotak = (točno / ukupno) * 100;
        
        if (postotak === 100) {
            return "Izvrsno! Sve si točno riješio/la!";
        } else if (postotak >= 80) {
            return "Vrlo dobro! Nastavi tako!";
        } else if (postotak >= 60) {
            return "Dobro! Još malo vježbe i bit će još bolje.";
        } else {
            return "Trebat će još vježbe. Ne odustaj!";
        }
    },

    // Poruke za vrijeme testa
    porukeTimera: function(vrijeme) {
        if (vrijeme <= 10) {
            return "Požuri, vrijeme ističe!";
        } else if (vrijeme <= 30) {
            return "Još samo pola minute!";
        } else if (vrijeme <= 60) {
            return "Preostala je još jedna minuta.";
        }
        return "";
    }
};

// Izvozi objekt za korištenje u drugim datotekama
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HrvatskiJezik;
}
