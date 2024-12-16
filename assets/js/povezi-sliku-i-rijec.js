jQuery(document).ready(function($) {
    // Stanje igre
    let state = {
        score: 0,
        level: 1,
        highScore: localStorage.getItem('poveziSlikuHighScore') || 0,
        gameMode: 'basic',
        difficulty: 'easy',
        soundEnabled: localStorage.getItem('poveziSlikuSoundEnabled') === 'true' || true,
        selectedImage: null,
        selectedWord: null,
        pairs: [],
        hintsUsed: 0
    };

    // Audio elementi
    console.log('Theme URL:', poveziSlikuIRijecData.themeUrl);
    const soundsPath = poveziSlikuIRijecData.themeUrl + '/assets/sounds/';
    console.log('Sounds path:', soundsPath);
    
    const correctSound = new Audio(soundsPath + 'correct.wav');
    const wrongSound = new Audio(soundsPath + 'wrong.wav');
    const levelUpSound = new Audio(soundsPath + 'levelup.wav');

    // Provjera učitavanja zvukova
    [correctSound, wrongSound, levelUpSound].forEach(sound => {
        sound.addEventListener('error', (e) => {
            console.error('Error loading sound:', e.target.src, e);
        });
        
        sound.addEventListener('loadeddata', () => {
            console.log('Sound loaded successfully:', sound.src);
        });

        // Predučitavanje zvukova
        sound.load();
    });

    // Funkcija za reprodukciju zvuka
    function playSound(sound) {
        if (state.soundEnabled && sound) {
            console.log('Attempting to play sound:', sound.src);
            // Resetiraj zvuk na početak
            sound.currentTime = 0;
            // Pokušaj reproducirati zvuk
            let playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Sound playing successfully:', sound.src);
                    })
                    .catch(error => {
                        console.error('Error playing sound:', sound.src, error);
                        // Pokušaj ponovno učitati zvuk
                        sound.load();
                    });
            }
        }
    }

    // Inicijalizacija igre
    function initGame() {
        console.log('Inicijalizacija igre...');
        updateUI();
        loadGameData();
    }

    // Dohvaćanje podataka igre
    function loadGameData() {
        console.log('Učitavanje podataka...');
        const pairs = [
            {
                image: poveziSlikuIRijecData.themeUrl + '/assets/images/geometrijski-likovi/kvadrat.svg',
                word: 'Kvadrat'
            },
            {
                image: poveziSlikuIRijecData.themeUrl + '/assets/images/geometrijski-likovi/trokut.svg',
                word: 'Trokut'
            },
            {
                image: poveziSlikuIRijecData.themeUrl + '/assets/images/geometrijski-likovi/krug.svg',
                word: 'Krug'
            }
        ];
        
        state.pairs = pairs;
        renderGame();
    }

    // Renderiranje igre
    function renderGame() {
        console.log('Renderiranje igre...');
        const imagesContainer = $('#images-container');
        const wordsContainer = $('#words-container');
        
        imagesContainer.empty();
        wordsContainer.empty();

        state.pairs.forEach((pair, index) => {
            const imageDiv = $('<div>')
                .addClass('image-item')
                .attr('data-index', index)
                .html(`<img src="${pair.image}" alt="Geometrijski lik ${index + 1}">`);

            const wordDiv = $('<div>')
                .addClass('word-item')
                .attr('data-index', index)
                .text(pair.word);

            imagesContainer.append(imageDiv);
            wordsContainer.append(wordDiv.clone());
        });

        // Nasumično poredaj riječi
        const words = wordsContainer.children().toArray();
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            wordsContainer.append(words[j]);
        }

        attachEventListeners();
    }

    // Dodavanje event listenera
    function attachEventListeners() {
        console.log('Dodavanje event listenera...');
        $('.image-item').click(handleImageClick);
        $('.word-item').click(handleWordClick);
        
        $('#basicMode').click(() => changeGameMode('basic'));
        $('#propertiesMode').click(() => changeGameMode('properties'));
        $('#anglesMode').click(() => changeGameMode('angles'));
        $('#sidesMode').click(() => changeGameMode('sides'));
        
        $('#easyMode').click(() => changeDifficulty('easy'));
        $('#mediumMode').click(() => changeDifficulty('medium'));
        $('#hardMode').click(() => changeDifficulty('hard'));
        
        $('#newTask').click(newGame);
        $('#checkAnswer').click(checkAnswers);
        $('#hint').click(showHint);
        $('#toggleSound').click(toggleSound);
        $('#printTasks').click(printTasks);
    }

    // Upravljanje klikovima na slike
    function handleImageClick() {
        console.log('Klik na sliku...');
        const index = $(this).data('index');
        
        if (state.selectedImage !== null) {
            $('.image-item').removeClass('selected');
        }
        
        $(this).addClass('selected');
        state.selectedImage = index;
        
        checkPair();
    }

    // Upravljanje klikovima na riječi
    function handleWordClick() {
        console.log('Klik na riječ...');
        const index = $(this).data('index');
        
        if (state.selectedWord !== null) {
            $('.word-item').removeClass('selected');
        }
        
        $(this).addClass('selected');
        state.selectedWord = index;
        
        checkPair();
    }

    // Provjera parova
    function checkPair() {
        console.log('Provjera parova...');
        if (state.selectedImage !== null && state.selectedWord !== null) {
            if (state.selectedImage === state.selectedWord) {
                // Točan odgovor
                $('.image-item[data-index="' + state.selectedImage + '"]').addClass('matched');
                $('.word-item[data-index="' + state.selectedWord + '"]').addClass('matched');
                
                playSound(correctSound);
                
                updateScore(10);
                showFeedback('Bravo! Točno si spojio/la par!', 'success');
            } else {
                // Netočan odgovor
                playSound(wrongSound);
                updateScore(-5);
                showFeedback('Pokušaj ponovno!', 'error');
            }
            
            state.selectedImage = null;
            state.selectedWord = null;
            $('.image-item, .word-item').removeClass('selected');
            
            checkLevelComplete();
        }
    }

    // Provjera je li razina završena
    function checkLevelComplete() {
        console.log('Provjera je li razina završena...');
        const matchedPairs = $('.matched').length / 2;
        if (matchedPairs === state.pairs.length) {
            playSound(levelUpSound);
            state.level++;
            showFeedback('Čestitamo! Prešli ste na sljedeću razinu!', 'success');
            setTimeout(newGame, 2000);
        }
    }

    // Ažuriranje rezultata
    function updateScore(points) {
        console.log('Ažuriranje rezultata...');
        state.score += points;
        if (state.score < 0) state.score = 0;
        if (state.score > state.highScore) {
            state.highScore = state.score;
            localStorage.setItem('poveziSlikuHighScore', state.highScore);
        }
        updateUI();
    }

    // Ažuriranje korisničkog sučelja
    function updateUI() {
        console.log('Ažuriranje korisničkog sučelja...');
        $('#score').text(state.score);
        $('#level').text(state.level);
        $('#highScore').text(state.highScore);
    }

    // Nova igra
    function newGame() {
        console.log('Nova igra...');
        state.selectedImage = null;
        state.selectedWord = null;
        loadGameData();
    }

    // Provjera odgovora
    function checkAnswers() {
        console.log('Provjera odgovora...');
        const matchedPairs = $('.matched').length / 2;
        showFeedback(`Točno ste spojili ${matchedPairs} od ${state.pairs.length} parova!`, 
            matchedPairs === state.pairs.length ? 'success' : 'error');
    }

    // Prikazivanje pomoći
    function showHint() {
        console.log('Prikazivanje pomoći...');
        
        // Pronađi par koji još nije spojen
        const unmatchedPairs = state.pairs.filter((pair, index) => {
            return !$(`.image-item[data-index="${index}"]`).hasClass('matched');
        });
        
        if (unmatchedPairs.length === 0) {
            showFeedback('Svi parovi su već spojeni!', 'success');
            return;
        }

        // Odaberi nasumični nespojeni par
        const randomPair = unmatchedPairs[Math.floor(Math.random() * unmatchedPairs.length)];
        const pairIndex = state.pairs.indexOf(randomPair);

        // Privremeno označi par
        const imageItem = $(`.image-item[data-index="${pairIndex}"]`);
        const wordItem = $(`.word-item[data-index="${pairIndex}"]`);

        imageItem.addClass('hint');
        wordItem.addClass('hint');

        // Smanji bodove za korištenje pomoći
        updateScore(-2);
        state.hintsUsed++;

        // Ukloni oznaku nakon 2 sekunde
        setTimeout(() => {
            imageItem.removeClass('hint');
            wordItem.removeClass('hint');
        }, 2000);
    }

    // Uključivanje/isključivanje zvuka
    function toggleSound() {
        console.log('Uključivanje/isključivanje zvuka...');
        state.soundEnabled = !state.soundEnabled;
        $('#toggleSound').text(state.soundEnabled ? '🔊 Zvuk' : '🔇 Zvuk');
        
        // Spremi postavku zvuka u localStorage
        localStorage.setItem('poveziSlikuSoundEnabled', state.soundEnabled);
        
        // Reproduciraj test zvuk ako je zvuk uključen
        if (state.soundEnabled) {
            playSound(correctSound);
        }
    }

    // Promjena načina igre
    function changeGameMode(mode) {
        console.log('Promjena načina igre...');
        state.gameMode = mode;
        $('.mode-button').removeClass('active');
        $(`#${mode}Mode`).addClass('active');
        newGame();
    }

    // Promjena težine
    function changeDifficulty(diff) {
        console.log('Promjena težine...');
        state.difficulty = diff;
        $('.difficulty-controls .button').removeClass('active');
        $(`#${diff}Mode`).addClass('active');
        newGame();
    }

    // Prikazivanje povratnih informacija
    function showFeedback(message, type) {
        console.log('Prikazivanje povratnih informacija...');
        const feedback = $('#feedback');
        feedback.removeClass('success error hidden').addClass(type).text(message);
        setTimeout(() => feedback.addClass('hidden'), 3000);
    }

    // Ispis zadataka
    function printTasks() {
        // Kreiraj novi prozor za print
        const printWindow = window.open('', '', 'width=800,height=600,top=50,left=50,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
        
        // Provjera je li prozor kreiran
        if (!printWindow) {
            alert('Molimo omogućite pop-up prozore za printanje.');
            return;
        }

        // Pripremi HTML za print
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Poveži Sliku i Riječ - Zadaci</title>
                <style>
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .print-task {
                        page-break-inside: avoid;
                        margin-bottom: 20px;
                    }
                    .print-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .print-item {
                        text-align: center;
                        padding: 10px;
                        border: 1px solid #ccc;
                    }
                    .print-image {
                        max-width: 150px;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                <h1>Poveži Sliku i Riječ - Zadaci</h1>
                <div class="print-task">
                    <div class="print-grid">
                        ${state.pairs.map(pair => `
                            <div class="print-item">
                                <img src="${pair.image}" class="print-image" alt="${pair.word}">
                            </div>
                            <div class="print-item">
                                <h3>${pair.word}</h3>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </body>
            </html>
        `;

        // Postavi sadržaj print prozora
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Čekaj da se sadržaj učita i pokreni print
        let printDialogClosed = false;
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printDialogClosed = true;
            }, 500);
        };

        // Provjeri je li print dijalog zatvoren
        const checkPrintDialog = setInterval(() => {
            if (!printDialogClosed && !printWindow.document.hasFocus()) {
                printWindow.close();
                clearInterval(checkPrintDialog);
            }
        }, 100);

        // Očisti interval nakon 10 sekundi
        setTimeout(() => {
            clearInterval(checkPrintDialog);
        }, 10000);
    }

    // Inicijalizacija igre
    initGame();
});
