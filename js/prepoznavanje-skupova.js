(function($) {
    'use strict';
    
    // Wait for document ready
    $(document).ready(function() {
        console.log('Game initialization starting');
        
        // Game variables
        let currentScore = 0;
        let maxScore = 5;
        let correctAnswer = null;
        let currentPattern = null;

        // Patterns for number sets
        const patterns = {
            easy: [
                {
                    name: 'Parni brojevi',
                    check: n => n % 2 === 0,
                    hint: 'Ovo su parni brojevi.'
                },
                {
                    name: 'Neparni brojevi',
                    check: n => n % 2 !== 0,
                    hint: 'Ovo su neparni brojevi.'
                },
                {
                    name: 'Brojevi manji od 10',
                    check: n => n < 10,
                    hint: 'Ovo su brojevi manji od 10.'
                }
            ],
            medium: [
                {
                    name: 'Djeljivi s 3',
                    check: n => n % 3 === 0,
                    hint: 'Ovo su brojevi djeljivi s 3.'
                },
                {
                    name: 'Djeljivi s 5',
                    check: n => n % 5 === 0,
                    hint: 'Ovo su brojevi djeljivi s 5.'
                },
                {
                    name: 'Dvoznamenkasti brojevi',
                    check: n => n >= 10,
                    hint: 'Ovo su dvoznamenkasti brojevi.'
                }
            ],
            hard: [
                {
                    name: 'Djeljivi s 4',
                    check: n => n % 4 === 0,
                    hint: 'Ovo su brojevi djeljivi s 4.'
                },
                {
                    name: 'Veći od 50',
                    check: n => n > 50,
                    hint: 'Ovo su brojevi veći od 50.'
                },
                {
                    name: 'Djeljivi s 6',
                    check: n => n % 6 === 0,
                    hint: 'Ovo su brojevi djeljivi s 6.'
                }
            ]
        };

        // Initialize the game
        function initializeGame() {
            console.log('Initializing game');
            currentScore = 0;
            updateStars();
            generateNewExercise();
        }

        // Generate a new exercise
        function generateNewExercise() {
            console.log('Generating new exercise');
            const difficulty = $('#difficultySelect').val() || 'easy';
            console.log('Difficulty:', difficulty);

            const ranges = {
                easy: [1, 30],
                medium: [1, 60],
                hard: [1, 100]
            };
            const range = ranges[difficulty];

            // Select random pattern for current difficulty
            const availablePatterns = patterns[difficulty];
            currentPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
            console.log('Selected pattern:', currentPattern.name);

            // Generate numbers that follow the pattern
            let numbers = [];
            let attempts = 0;
            const maxAttempts = 100;

            while (numbers.length < 5 && attempts < maxAttempts) {
                const num = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
                if (currentPattern.check(num) && !numbers.includes(num)) {
                    numbers.push(num);
                }
                attempts++;
            }

            if (numbers.length < 5) {
                console.error('Failed to generate enough numbers for the pattern');
                return;
            }

            console.log('Pattern numbers:', numbers);

            // Generate the number that doesn't follow the pattern
            let oddOneOut;
            attempts = 0;
            do {
                oddOneOut = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
                attempts++;
            } while ((currentPattern.check(oddOneOut) || numbers.includes(oddOneOut)) && attempts < maxAttempts);

            if (attempts >= maxAttempts) {
                console.error('Failed to generate odd number out');
                return;
            }

            console.log('Odd number out:', oddOneOut);

            // Insert the odd number at a random position
            const insertPosition = Math.floor(Math.random() * numbers.length);
            numbers.splice(insertPosition, 0, oddOneOut);
            correctAnswer = oddOneOut;

            console.log('Final number set:', numbers);

            // Display the numbers
            const numberSet = $('#numberSet');
            if (numberSet.length === 0) {
                console.error('#numberSet element not found');
                return;
            }

            numberSet.empty();
            console.log('Generated numbers:', numbers);
            console.log('Appending numbers to #numberSet');
            numbers.forEach(num => {
                const numberItem = $('<div>')
                    .addClass('number-item')
                    .text(num)
                    .on('click', function() {
                        $('#userAnswer').val(num);
                    });
                numberSet.append(numberItem);
            });
            console.log('Numbers appended to #numberSet');

            // Show pattern hint based on difficulty
            const patternHint = $('#patternHint');
            if (difficulty === 'easy') {
                patternHint.text(currentPattern.hint).show();
            } else {
                patternHint.text('').hide();
            }

            // Reset UI elements
            $('#feedback').removeClass('feedback-correct feedback-incorrect').text('');
            $('#userAnswer').val('').focus();
            $('#checkmark').removeClass('show');
        }

        // Check the user's answer
        function checkAnswer() {
            const userAnswer = parseInt($('#userAnswer').val());
            const feedback = $('#feedback');
            
            if (isNaN(userAnswer)) {
                feedback.removeClass('feedback-correct feedback-incorrect')
                    .addClass('feedback-incorrect')
                    .text('Molimo unesite broj!');
                return;
            }

            const isCorrect = userAnswer === correctAnswer;
            feedback.removeClass('feedback-correct feedback-incorrect')
                .addClass(isCorrect ? 'feedback-correct' : 'feedback-incorrect')
                .text(isCorrect ? 'Točno!' : 'Netočno. Pokušaj ponovno!');

            if (isCorrect) {
                $('#checkmark').addClass('show');
                updateScore(1);
                setTimeout(() => {
                    $('#checkmark').removeClass('show');
                    if (currentScore < maxScore) {
                        generateNewExercise();
                    } else {
                        showCongratulations();
                    }
                }, 1500);
            }
        }

        // Show congratulations message
        function showCongratulations() {
            const feedback = $('#feedback');
            feedback.removeClass('feedback-incorrect')
                .addClass('feedback-correct')
                .html('Čestitamo! Završili ste sve zadatke!<br>Možete započeti novu igru ili ispisati zadatke za vježbu.');
        }

        // Update the score and stars
        function updateScore(points) {
            currentScore = Math.min(currentScore + points, maxScore);
            $('#scoreDisplay').text(currentScore);
            updateStars();
        }

        // Update the star display
        function updateStars() {
            const stars = $('.star');
            stars.each(function(index) {
                $(this).text(index < currentScore ? '★' : '☆')
                    .toggleClass('filled', index < currentScore);
            });
        }

        // Generate printable exercises
        function generatePrintableExercises() {
            const difficulty = $('#difficultySelect').val();
            let printContent = '';
            
            for (let i = 0; i < 10; i++) {
                const exercise = generatePrintableExercise(difficulty);
                printContent += `
                    <div class="print-exercise">
                        <div class="exercise-number">${i + 1}.</div>
                        <p>Koji broj ne pripada ovom nizu?</p>
                        <div class="number-row">${exercise.numbers.join(' ')}</div>
                        <div class="pattern-hint">${exercise.hint}</div>
                        <div class="answer-line">Odgovor: _____________</div>
                    </div>
                `;
            }
            
            $('#exercisesList').html(printContent);
            window.print();
        }

        // Generate a single printable exercise
        function generatePrintableExercise(difficulty) {
            const ranges = {
                easy: [1, 30],
                medium: [1, 60],
                hard: [1, 100]
            };
            const range = ranges[difficulty];
            
            const availablePatterns = patterns[difficulty];
            const pattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
            
            let numbers = [];
            while (numbers.length < 5) {
                const num = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
                if (pattern.check(num) && !numbers.includes(num)) {
                    numbers.push(num);
                }
            }

            let oddOneOut;
            do {
                oddOneOut = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
            } while (pattern.check(oddOneOut) || numbers.includes(oddOneOut));

            const insertPosition = Math.floor(Math.random() * numbers.length);
            numbers.splice(insertPosition, 0, oddOneOut);

            return {
                numbers: numbers,
                answer: oddOneOut,
                hint: difficulty === 'easy' ? pattern.hint : ''
            };
        }

        // Event listeners
        $('#checkAnswer').on('click', checkAnswer);
        $('#newExercise').on('click', function() {
            if (currentScore === maxScore) {
                currentScore = 0;
                updateStars();
            }
            generateNewExercise();
        });
        $('#printExercises').on('click', generatePrintableExercises);
        $('#userAnswer').on('keypress', function(e) {
            if (e.which === 13) checkAnswer();
        });
        $('#difficultySelect').on('change', function() {
            currentScore = 0;
            updateStars();
            generateNewExercise();
        });

        // Start the game
        console.log('Starting game initialization');
        initializeGame();
    });
})(jQuery);
