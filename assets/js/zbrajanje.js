jQuery(document).ready(function($) {
    let currentTask = null;
    let score = { correct: 0, total: 0 };
    let useInput = false;

    // Generiranje nasumičnog broja između min i max
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generiranje novog zadatka
    function generateTask() {
        const num1 = randomNumber(0, 20);
        const num2 = randomNumber(0, 20 - num1); // Osiguravamo da zbroj ne prelazi 20
        const result = num1 + num2;

        currentTask = {
            num1: num1,
            num2: num2,
            result: result
        };

        $('#task').html(`${num1} + ${num2} = ?`);
        
        if (!useInput) {
            generateOptions(result);
        }
        
        $('#next').hide();
        $('#feedback').removeClass('correct incorrect').empty();
        $('#userInput').val('');
    }

    // Generiranje ponuđenih odgovora
    function generateOptions(correctAnswer) {
        const options = new Set();
        options.add(correctAnswer);
        
        while(options.size < 4) {
            const wrong = randomNumber(Math.max(0, correctAnswer - 5), Math.min(20, correctAnswer + 5));
            if(wrong !== correctAnswer) {
                options.add(wrong);
            }
        }

        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
        
        const optionsHtml = shuffledOptions.map(option => 
            `<button class="option" data-value="${option}">${option}</button>`
        ).join('');
        
        $('#options').html(optionsHtml);
    }

    // Provjera odgovora
    function checkAnswer(userAnswer) {
        const correct = currentTask.result === parseInt(userAnswer);
        score.total++;
        
        if (correct) {
            score.correct++;
            $('#feedback').removeClass('incorrect').addClass('correct').html('Točno! 🎉');
        } else {
            $('#feedback').removeClass('correct').addClass('incorrect')
                .html(`Netočno. Točan odgovor je ${currentTask.result}`);
        }
        
        updateScore();
        $('#next').show();
        $('.option').prop('disabled', true);
        $('#userInput').prop('disabled', true);
    }

    // Ažuriranje rezultata
    function updateScore() {
        const percentage = (score.correct / score.total * 100).toFixed(1);
        $('#score').text(`Rezultat: ${score.correct}/${score.total} (${percentage}%)`);
    }

    // Event handleri
    $('#options').on('click', '.option', function() {
        const selectedAnswer = $(this).data('value');
        checkAnswer(selectedAnswer);
    });

    $('#userInput').on('keypress', function(e) {
        if(e.which === 13) {
            const answer = $(this).val();
            if(answer !== '') {
                checkAnswer(answer);
            }
        }
    });

    $('#next').on('click', function() {
        generateTask();
    });

    $('#toggleInput').on('click', function() {
        useInput = !useInput;
        if(useInput) {
            $('#options').hide();
            $('#inputContainer').show();
            $(this).text('Prebaci na izbor');
        } else {
            $('#options').show();
            $('#inputContainer').hide();
            $(this).text('Prebaci na unos');
        }
        generateTask();
    });

    $('#hint').on('click', function() {
        const hint = `${currentTask.num1} + ${currentTask.num2} = ` + 
                    `Prvo dodaj do 10: ${currentTask.num1} + ${Math.min(10 - currentTask.num1, currentTask.num2)} = ${Math.min(10, currentTask.num1 + currentTask.num2)}, ` +
                    `zatim dodaj ostatak: ${Math.min(10, currentTask.num1 + currentTask.num2)} + ${Math.max(0, currentTask.num2 - (10 - currentTask.num1))} = ${currentTask.result}`;
        $('#feedback').html(hint);
    });

    $('#print').on('click', function() {
        const printWindow = window.open('', '', 'width=800,height=600');
        const tasks = [];
        
        // Generiranje 10 zadataka za print
        for(let i = 0; i < 10; i++) {
            const num1 = randomNumber(0, 20);
            const num2 = randomNumber(0, 20 - num1);
            tasks.push(`${num1} + ${num2} = ____`);
        }

        const printContent = `
            <html>
            <head>
                <title>Zadaci za zbrajanje do 20</title>
                <style>
                    body { font-family: 'Comic Neue', cursive; padding: 20px; }
                    .task { font-size: 24px; margin: 20px 0; }
                    @page { margin: 2cm; }
                    .task { page-break-inside: avoid; }
                </style>
            </head>
            <body>
                <h1>Zadaci za zbrajanje do 20</h1>
                ${tasks.map((task, index) => `
                    <div class="task">
                        ${index + 1}. ${task}
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        // Čekamo da se sadržaj učita prije pokretanja printa
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                
                // Provjera zatvaranja print dijaloga
                let printDialogClosed = false;
                const checkPrintDialog = setInterval(() => {
                    if (!printDialogClosed && !printWindow.document.hasFocus()) {
                        printWindow.close();
                        clearInterval(checkPrintDialog);
                    }
                }, 100);

                // Čišćenje intervala nakon 10 sekundi
                setTimeout(() => {
                    clearInterval(checkPrintDialog);
                }, 10000);
            }, 500);
        };
    });

    // Inicijalno generiranje zadatka
    generateTask();
});
