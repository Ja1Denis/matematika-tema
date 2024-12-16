// Padezi
const CASES = {
    NOMINATIVE: 'nominativ',
    GENITIVE: 'genitiv',
    DATIVE: 'dativ',
    ACCUSATIVE: 'akuzativ',
    VOCATIVE: 'vokativ',
    LOCATIVE: 'lokativ',
    INSTRUMENTAL: 'instrumental'
};

// Pravila za deklinaciju brojeva
const numberWords = {
    1: 'jedna',  
    2: 'dvije',  
    3: 'tri',
    4: 'četiri',
    5: 'pet',
    6: 'šest',
    7: 'sedam',
    8: 'osam',
    9: 'devet',
    10: 'deset',
    11: 'jedanaest',
    12: 'dvanaest',
    13: 'trinaest',
    14: 'četrnaest',
    15: 'petnaest',
    16: 'šesnaest',
    17: 'sedamnaest',
    18: 'osamnaest',
    19: 'devetnaest',
    20: 'dvadeset'
};

// Pravila za deklinaciju brojeva po rodu
const numberWordsByGender = {
    masculine: {
        1: 'jedan',
        2: 'dva',
        3: 'tri',
        4: 'četiri',
        5: 'pet',
        6: 'šest',
        7: 'sedam',
        8: 'osam',
        9: 'devet',
        10: 'deset',
        11: 'jedanaest',
        12: 'dvanaest',
        13: 'trinaest',
        14: 'četrnaest',
        15: 'petnaest',
        16: 'šesnaest',
        17: 'sedamnaest',
        18: 'osamnaest',
        19: 'devetnaest',
        20: 'dvadeset'
    },
    feminine: {
        1: 'jedna',
        2: 'dvije',
        3: 'tri',
        4: 'četiri',
        5: 'pet',
        6: 'šest',
        7: 'sedam',
        8: 'osam',
        9: 'devet',
        10: 'deset',
        11: 'jedanaest',
        12: 'dvanaest',
        13: 'trinaest',
        14: 'četrnaest',
        15: 'petnaest',
        16: 'šesnaest',
        17: 'sedamnaest',
        18: 'osamnaest',
        19: 'devetnaest',
        20: 'dvadeset'
    }
};

// Funkcija za određivanje roda imenice
function getNounGender(noun) {
    const masculineNouns = ['sendvič', 'bombon', 'kilogram', 'balon'];
    const feminineNouns = ['ptica', 'jabuka', 'lopta', 'sličica', 'čokolada', 'lizalica', 'naranča'];
    
    if (masculineNouns.includes(noun)) return 'masculine';
    if (feminineNouns.includes(noun)) return 'feminine';
    return 'masculine'; // zadani rod
}

// Funkcija za dobivanje pravilnog oblika broja
function getNumberWord(number, noun) {
    const gender = getNounGender(noun);
    return numberWordsByGender[gender][number] || numberWordsByGender.masculine[number];
}

// Funkcija za deklinaciju imenica prema broju
function declineNounByNumber(number, noun) {
    const nounForms = {
        bombon: {
            singular: {
                nominative: 'bombon',
                genitive: 'bombona'
            },
            paucal: 'bombona',    
            plural: 'bombona'     
        },
        sendvič: {
            singular: {
                nominative: 'sendvič',
                genitive: 'sendviča'
            },
            paucal: 'sendviča',
            plural: 'sendviča'
        },
        ptica: {
            singular: {
                nominative: 'ptica',
                genitive: 'ptice'
            },
            paucal: 'ptice',
            plural: 'ptica'
        },
        kilogram: {
            singular: {
                nominative: 'kilogram',
                genitive: 'kilograma'
            },
            paucal: 'kilograma',
            plural: 'kilograma'
        },
        jabuka: {
            singular: {
                nominative: 'jabuka',
                genitive: 'jabuke'
            },
            paucal: 'jabuke',
            plural: 'jabuka'
        },
        lopta: {
            singular: {
                nominative: 'lopta',
                genitive: 'lopte'
            },
            paucal: 'lopte',
            plural: 'lopti'
        },
        sličica: {
            singular: {
                nominative: 'sličica',
                genitive: 'sličice'
            },
            paucal: 'sličice',
            plural: 'sličica'
        },
        čokolada: {
            singular: {
                nominative: 'čokolada',
                genitive: 'čokolade'
            },
            paucal: 'čokolade',
            plural: 'čokolada'
        },
        balon: {
            singular: {
                nominative: 'balon',
                genitive: 'balona'
            },
            paucal: 'balona',
            plural: 'balona'
        },
        kocka: {
            singular: {
                nominative: 'kocka',
                genitive: 'kocke'
            },
            paucal: 'kocke',
            plural: 'kocki'
        }
    };

    if (!nounForms[noun]) {
        console.warn(`Imenica "${noun}" nije definirana u sustavu deklinacija.`);
        return noun;
    }

    if (number === 1) {
        return nounForms[noun].singular.nominative;
    } else if (number >= 2 && number <= 4) {
        return nounForms[noun].paucal;
    } else {
        return nounForms[noun].plural;
    }
}

// Funkcija za deklinaciju imena
function declineName(name, padez = CASES.NOMINATIVE) {
    const nameRules = {
        consonantEnding: {
            test: (name) => /[bcčćdđfghjklmnprsštvzž]$/i.test(name),
            decline: (name) => ({
                [CASES.NOMINATIVE]: name,
                [CASES.GENITIVE]: name + 'a',
                [CASES.DATIVE]: name + 'u',
                [CASES.ACCUSATIVE]: name + 'a',
                [CASES.VOCATIVE]: name + 'e',
                [CASES.LOCATIVE]: name + 'u',
                [CASES.INSTRUMENTAL]: name + 'om'
            })
        },
        aEnding: {
            test: (name) => /a$/i.test(name),
            decline: (name) => {
                const stem = name.slice(0, -1);
                const needsPalatalization = /[cčćsšzž]$/.test(stem);
                return {
                    [CASES.NOMINATIVE]: name,
                    [CASES.GENITIVE]: stem + 'e',
                    [CASES.DATIVE]: stem + 'i',
                    [CASES.ACCUSATIVE]: stem + 'u',
                    [CASES.VOCATIVE]: needsPalatalization ? stem + 'e' : name,
                    [CASES.LOCATIVE]: stem + 'i',
                    [CASES.INSTRUMENTAL]: stem + 'om'
                };
            }
        },
        oEnding: {
            test: (name) => /[oe]$/i.test(name),
            decline: (name) => ({
                [CASES.NOMINATIVE]: name,
                [CASES.GENITIVE]: name + 'a',
                [CASES.DATIVE]: name + 'u',
                [CASES.ACCUSATIVE]: name + 'a',
                [CASES.VOCATIVE]: name,
                [CASES.LOCATIVE]: name + 'u',
                [CASES.INSTRUMENTAL]: name + 'om'
            })
        }
    };

    const rule = Object.values(nameRules).find(rule => rule.test(name));
    if (!rule) {
        console.warn(`Nije pronađeno pravilo za deklinaciju imena "${name}"`);
        return name;
    }

    const declensions = rule.decline(name);
    return declensions[padez] || name;
}

// Funkcija za slaganje glagola s rodom
function getVerbGenderForm(name, masculine, feminine, neutral) {
    // Muška imena koja završavaju na -o ili suglasnik
    if (/o$|[bcčćdđfghjklmnprsštvzž]$/i.test(name)) {
        return masculine;
    }
    // Ženska imena koja završavaju na -a
    else if (/a$/i.test(name)) {
        // Posebni slučajevi za muška imena koja završavaju na -a
        const maleNamesEndingInA = ['Luka', 'Nikola', 'Matija', 'Tata', 'Djeda'];
        if (maleNamesEndingInA.includes(name)) {
            return masculine;
        }
        return feminine;
    }
    // Imena koja završavaju na -e
    else if (/e$/i.test(name)) {
        // Posebni slučajevi za srednji rod
        const neutralNouns = ['janje', 'dijete', 'čedo'];
        if (neutralNouns.includes(name.toLowerCase())) {
            return neutral;
        }
        // Muška imena koja završavaju na -e
        return masculine;
    }
    // Zadani slučaj - muški rod
    return masculine;
}

// Globalni objekt za deklinaciju
const declension = {
    CASES,
    numberWords: numberWordsByGender.feminine, // za kompatibilnost sa starim kodom
    declineNounByNumber,
    declineName,
    getVerbGenderForm,
    getNumberWord // dodajemo novu funkciju
};
