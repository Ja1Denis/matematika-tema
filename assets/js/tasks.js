(function($) {
    // Predlošci zadataka
    const taskTemplates = [
        {
            id: 'ptice',
            template: (a, b) => {
                const ptice = declension.declineNounByNumber(a, 'ptica');
                const suBile = (a >= 2 && a <= 4) ? 'su bile' : 'je bilo';
                const odletjele = b === 1 ? 'je odletjela' : 'su odletjele';
                return `Na grani ${suBile} ${declension.getNumberWord(a, 'ptica')} ${ptice}. Od njih ${declension.getVerbGenderForm('ptica', 'je odletio', 'je odletjela', 'je odletjelo')} ${declension.getNumberWord(b, 'ptica')} ${ptice}.
Koliko je ptica sada na grani?`;
            },
            generate: () => {
                const total = Math.floor(Math.random() * 5) + 2;
                const leave = Math.floor(Math.random() * (total - 1)) + 1;
                return { numbers: [total, leave], answer: total - leave };
            }
        },
        {
            id: 'bomboni',
            template: (a, b) => {
                const childName = names.children[Math.floor(Math.random() * names.children.length)];
                const bomboni = declension.declineNounByNumber(a, 'bombon');
                const pojedeni = declension.declineNounByNumber(b, 'bombon');
                const glagol = declension.getVerbGenderForm(childName, 'pojeo', 'pojela', 'pojelo');
                return `${childName} je ${declension.getVerbGenderForm(childName, 'kupio', 'kupila', 'kupilo')} ${declension.getNumberWord(a, 'bombon')} ${bomboni}. ${declension.getNumberWord(b, 'bombon').charAt(0).toUpperCase() + declension.getNumberWord(b, 'bombon').slice(1)} ${pojedeni} je ${glagol}.
Koliko bombona ima sada?`;
            },
            generate: () => {
                const total = Math.floor(Math.random() * 5) + 2;
                const eat = Math.floor(Math.random() * (total - 1)) + 1;
                return { numbers: [total, eat], answer: total - eat };
            }
        },
        {
            id: 'brasno',
            template: (a, b) => {
                const adultName = names.adults[Math.floor(Math.random() * names.adults.length)];
                const kilogrami = declension.declineNounByNumber(a, 'kilogram');
                const potroseni = declension.declineNounByNumber(b, 'kilogram');
                const jeBilo = (a >= 2 && a <= 4) ? 'su bila' : 'je bilo';
                const glagol = declension.getVerbGenderForm(adultName, 'potrošio', 'potrošila', 'potrošilo');
                return `U vreći ${jeBilo} ${declension.getNumberWord(a, 'kilogram')} ${kilogrami} brašna. ${adultName} je od toga ${glagol} ${declension.getNumberWord(b, 'kilogram')} ${potroseni}.
Koliko je kilograma brašna ostalo u vreći?`;
            },
            generate: () => {
                const total = Math.floor(Math.random() * 5) + 2;
                const used = Math.floor(Math.random() * (total - 1)) + 1;
                return { numbers: [total, used], answer: total - used };
            }
        },
        {
            id: 'sendvici',
            template: (a, b) => {
                const childName = names.children[Math.floor(Math.random() * names.children.length)];
                const sendvici = declension.declineNounByNumber(a, 'sendvič');
                const pojedeni = declension.declineNounByNumber(b, 'sendvič');
                const glagol = declension.getVerbGenderForm(childName, 'pojeo', 'pojela', 'pojelo');
                const ponio = declension.getVerbGenderForm(childName, 'ponio', 'ponijela', 'ponijelo');
                return `${childName} je na izlet ${ponio} ${declension.getNumberWord(a, 'sendvič')} ${sendvici}. Tamo je ${glagol} ${declension.getNumberWord(b, 'sendvič')} ${pojedeni}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je sendviča ostalo?`;
            },
            generate: () => {
                const total = Math.floor(Math.random() * 5) + 2;
                const eaten = Math.floor(Math.random() * (total - 1)) + 1;
                return { numbers: [total, eaten], answer: total - eaten };
            }
        },
        {
            id: 'jabuke',
            template: (a, b) => {
                const childName = names.children[Math.floor(Math.random() * names.children.length)];
                const jabuke = declension.declineNounByNumber(a, 'jabuka');
                const pojedene = declension.declineNounByNumber(b, 'jabuka');
                const glagol = declension.getVerbGenderForm(childName, 'pojeo', 'pojela', 'pojelo');
                return `${childName} je ${declension.getVerbGenderForm(childName, 'ubrao', 'ubrala', 'ubralo')} ${declension.getNumberWord(a, 'jabuka')} ${jabuke}. Nakon toga je ${glagol} ${declension.getNumberWord(b, 'jabuka')} ${pojedene}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je jabuka ostalo?`;
            },
            generate: () => {
                const total = Math.floor(Math.random() * 5) + 2;
                const eaten = Math.floor(Math.random() * (total - 1)) + 1;
                return { numbers: [total, eaten], answer: total - eaten };
            }
        },
        {
            id: 'lopte',
            template: (a, b) => {
                const childName = names.children[Math.floor(Math.random() * names.children.length)];
                const lopte = declension.declineNounByNumber(a, 'lopta');
                const izgubljene = declension.declineNounByNumber(b, 'lopta');
                const glagol = declension.getVerbGenderForm(childName, 'izgubio', 'izgubila', 'izgubilo');
                return `${childName} je ${declension.getVerbGenderForm(childName, 'imao', 'imala', 'imalo')} ${declension.getNumberWord(a, 'lopta')} ${lopte}. Zatim je ${glagol} ${declension.getNumberWord(b, 'lopta')} ${izgubljene}.
Koliko ${declension.getVerbGenderForm(childName, 'mu', 'joj', 'mu')} je lopti ostalo?`;
            },
            generate: () => {
                const total = Math.floor(Math.random() * 5) + 2;
                const lost = Math.floor(Math.random() * (total - 1)) + 1;
                return { numbers: [total, lost], answer: total - lost };
            }
        }
    ];

    // Funkcija za generiranje novog zadatka
    window.generateNewTask = function() {
        const task = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
        const { numbers, answer } = task.generate();
        const taskText = task.template(numbers[0], numbers[1]);
        $('#taskText').text(taskText);
        $('#taskText').data('answer', answer);
    }

    // Funkcija za provjeru odgovora
    window.checkAnswer = function() {
        const userAnswer = parseInt($('#userAnswer').val(), 10);
        const correctAnswer = $('#taskText').data('answer');
        if (userAnswer === correctAnswer) {
            $('#result').text('Točno!');
            const currentScore = parseInt($('#score').text().split(': ')[1], 10);
            $('#score').text(`Bodovi: ${currentScore + 1}`);
        } else {
            $('#result').text('Netočno, pokušaj ponovno.');
        }
    }

    // Funkcija za generiranje pregleda za ispis
    window.generatePrintPreview = function() {
        const taskList = [];
        for (let i = 0; i < 5; i++) {
            const task = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
            const { numbers, answer } = task.generate();
            const taskText = task.template(numbers[0], numbers[1]);
            taskList.push(`<li>${taskText} (Odgovor: ${answer})</li>`);
        }
        $('#printTaskList').html(taskList.join(''));
    }

})(jQuery);
