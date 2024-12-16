jQuery(document).ready(function($) {
    // State management
    let currentGrade = null;
    let currentTopic = null;
    let currentQuestion = 1;
    let totalQuestions = 10;
    let userAnswers = [];
    let questions = [];

    // Topics by grade
    const topicsByGrade = {
        1: [
            { id: 'addition', name: 'Zbrajanje', description: 'Vježbaj zbrajanje brojeva do 20', difficulty: 1 },
            { id: 'subtraction', name: 'Oduzimanje', description: 'Vježbaj oduzimanje brojeva do 20', difficulty: 1 },
            { id: 'shapes', name: 'Geometrijski oblici', description: 'Upoznaj osnovne geometrijske oblike', difficulty: 1 },
            { id: 'time', name: 'Vrijeme', description: 'Nauči čitati vrijeme na satu', difficulty: 2 },
            { id: 'money', name: 'Novac', description: 'Upoznaj se s novcem i računanjem', difficulty: 2 }
        ],
        2: [
            { id: 'multiplication', name: 'Množenje', description: 'Vježbaj množenje jednoznamenkastih brojeva', difficulty: 2 },
            { id: 'division', name: 'Dijeljenje', description: 'Vježbaj dijeljenje jednoznamenkastih brojeva', difficulty: 2 },
            { id: 'fractions-intro', name: 'Razlomci', description: 'Uvod u razlomke', difficulty: 2 },
            { id: 'money-advanced', name: 'Novac i računanje', description: 'Složenije računanje s novcem', difficulty: 2 },
            { id: 'measurement', name: 'Mjerenje', description: 'Duljina, masa i volumen', difficulty: 2 }
        ],
        3: [
            { id: 'decimals', name: 'Decimalni brojevi', description: 'Uvod u decimalne brojeve', difficulty: 2 },
            { id: 'area', name: 'Površina', description: 'Računanje površine jednostavnih likova', difficulty: 2 },
            { id: 'perimeter', name: 'Opseg', description: 'Računanje opsega jednostavnih likova', difficulty: 2 },
            { id: 'statistics', name: 'Statistika', description: 'Osnovni pojmovi statistike', difficulty: 2 },
            { id: 'patterns', name: 'Uzorci', description: 'Prepoznavanje i nastavljanje uzoraka', difficulty: 2 }
        ],
        4: [
            { id: 'angles', name: 'Kutovi', description: 'Vrste i mjerenje kutova', difficulty: 2 },
            { id: 'coordinates', name: 'Koordinate', description: 'Uvod u koordinatni sustav', difficulty: 2 },
            { id: 'symmetry', name: 'Simetrija', description: 'Osna i centralna simetrija', difficulty: 2 },
            { id: 'probability', name: 'Vjerojatnost', description: 'Osnovni pojmovi vjerojatnosti', difficulty: 2 },
            { id: 'fractions-operations', name: 'Operacije s razlomcima', description: 'Zbrajanje i oduzimanje razlomaka', difficulty: 3 }
        ],
        5: [
            { id: 'fractions-advanced', name: 'Razlomci', description: 'Složenije operacije s razlomcima', difficulty: 3 },
            { id: 'decimals-advanced', name: 'Decimalni brojevi', description: 'Složenije operacije s decimalnim brojevima', difficulty: 3 },
            { id: 'percentages', name: 'Postoci', description: 'Računanje s postocima', difficulty: 3 },
            { id: 'geometry-2d', name: '2D geometrija', description: 'Složeniji geometrijski likovi', difficulty: 3 },
            { id: 'measurement-advanced', name: 'Mjerne jedinice', description: 'Pretvaranje mjernih jedinica', difficulty: 3 }
        ],
        6: [
            { id: 'integers', name: 'Cijeli brojevi', description: 'Operacije s cijelim brojevima', difficulty: 3 },
            { id: 'equations', name: 'Linearne jednadžbe', description: 'Rješavanje linearnih jednadžbi', difficulty: 3 },
            { id: 'triangles', name: 'Trokuti', description: 'Vrste i svojstva trokuta', difficulty: 3 },
            { id: 'data-analysis', name: 'Analiza podataka', description: 'Grafički prikaz podataka', difficulty: 3 },
            { id: 'ratios', name: 'Omjeri', description: 'Računanje s omjerima', difficulty: 3 }
        ],
        7: [
            { id: 'proportions', name: 'Proporcionalnost', description: 'Direktna i obrnuta proporcionalnost', difficulty: 3 },
            { id: 'algebra', name: 'Algebarski izrazi', description: 'Računanje s algebarskim izrazima', difficulty: 3 },
            { id: 'circle', name: 'Kružnica', description: 'Svojstva kružnice i kruga', difficulty: 3 },
            { id: 'geometry-3d', name: '3D geometrija', description: 'Geometrijska tijela', difficulty: 3 },
            { id: 'statistics-advanced', name: 'Napredna statistika', description: 'Srednje vrijednosti i raspršenost', difficulty: 4 }
        ],
        8: [
            { id: 'square-root', name: 'Kvadriranje', description: 'Kvadriranje i korjenovanje', difficulty: 4 },
            { id: 'pythagoras', name: 'Pitagorin poučak', description: 'Primjena Pitagorinog poučka', difficulty: 4 },
            { id: 'vectors', name: 'Vektori', description: 'Osnovne operacije s vektorima', difficulty: 4 },
            { id: 'functions', name: 'Funkcije', description: 'Linearna funkcija', difficulty: 4 },
            { id: 'probability-advanced', name: 'Napredna vjerojatnost', description: 'Vjerojatnost složenih događaja', difficulty: 4 }
        ]
    };

    // Event Handlers
    $('.grade-option').on('click', function() {
        currentGrade = $(this).data('grade');
        showTopicSelection();
    });

    $('#back-to-grades').on('click', function() {
        $('#topic-selection').hide();
        $('#grade-selection').show();
    });

    $('#back-to-topics').on('click', function() {
        if(confirm('Jeste li sigurni da želite prekinuti provjeru? Svi odgovori će biti izgubljeni.')) {
            $('#assessment-content').hide();
            $('#topic-selection').show();
            resetAssessment();
        }
    });

    function showTopicSelection() {
        const topics = topicsByGrade[currentGrade];
        const topicsHtml = topics.map(topic => createTopicCard(topic)).join('');
        
        $('.topics-grid').html(topicsHtml);
        $('#grade-selection').hide();
        $('#topic-selection').show();

        // Add click handlers to topic cards
        $('.topic-card').on('click', function() {
            currentTopic = $(this).data('topic-id');
            startAssessment();
        });
    }

    function createTopicCard(topic) {
        const difficultyDots = Array(3).fill(0).map((_, i) => 
            `<div class="difficulty-dot${i < topic.difficulty ? ' active' : ''}"></div>`
        ).join('');

        return `
            <div class="topic-card" data-topic-id="${topic.id}">
                <h3>${topic.name}</h3>
                <p class="topic-description">${topic.description}</p>
                <div class="topic-stats">
                    <div class="topic-difficulty">
                        <span>Težina:</span>
                        <div class="difficulty-dots">
                            ${difficultyDots}
                        </div>
                    </div>
                    <div class="topic-progress">
                        <span>0%</span>
                    </div>
                </div>
            </div>
        `;
    }

    function startAssessment() {
        // Reset state
        currentQuestion = 1;
        userAnswers = [];
        
        // Load questions for the selected topic
        loadQuestions().then(() => {
            updateAssessmentUI();
            $('#topic-selection').hide();
            $('#assessment-content').show();
        });
    }

    function loadQuestions() {
        // Simulate loading questions from server
        return new Promise((resolve) => {
            // Here you would normally make an AJAX call to get questions
            setTimeout(() => {
                questions = generateMockQuestions();
                resolve();
            }, 500);
        });
    }

    function generateMockQuestions() {
        // Primjeri različitih tipova pitanja
        const questionTypes = [
            {
                type: 'multiple-choice',
                question: 'Koji je rezultat: \\(2x + 3 = 7\\)?',
                answers: [
                    { id: 'a', text: '\\(x = 2\\)' },
                    { id: 'b', text: '\\(x = 3\\)' },
                    { id: 'c', text: '\\(x = 4\\)' },
                    { id: 'd', text: '\\(x = 5\\)' }
                ],
                correctAnswer: 'a'
            },
            {
                type: 'drawing',
                question: 'Nacrtaj pravokutni trokut s katetama duljine 3 i 4.',
                correctAnswer: {
                    type: 'coordinates',
                    points: [[0,0], [3,0], [3,4], [0,0]]
                }
            },
            {
                type: 'drag-drop',
                question: 'Razvrstaj brojeve prema djelljivosti s 3:',
                items: ['9', '14', '21', '25', '30', '42'],
                zones: [
                    { id: 'divisible', label: 'Djeljivi s 3' },
                    { id: 'not-divisible', label: 'Nisu djeljivi s 3' }
                ],
                correctAnswer: {
                    'divisible': ['9', '21', '30', '42'],
                    'not-divisible': ['14', '25']
                }
            },
            {
                type: 'math-input',
                question: 'Zapiši algebarski izraz za: "Dvostruko uvećan zbroj broja x i broja 5"',
                correctAnswer: '2(x + 5)'
            }
        ];

        // Generiranje pitanja za odabranu temu
        return Array(totalQuestions).fill(0).map((_, i) => {
            const type = questionTypes[i % questionTypes.length];
            return {
                id: i + 1,
                ...type
            };
        });
    }

    function updateAssessmentUI() {
        const question = questions[currentQuestion - 1];
        
        // Update progress
        $('#current-question').text(currentQuestion);
        $('#total-questions').text(totalQuestions);
        $('.progress-fill').css('width', `${(currentQuestion / totalQuestions) * 100}%`);

        // Reset interactive areas
        $('#question-image, #interactive-area, #drawing-canvas').hide();
        $('.drawing-tools').remove();

        // Update question text with MathJax
        $('#question-text').html(question.question);
        MathJax.typesetPromise();

        // Handle different question types
        switch(question.type) {
            case 'multiple-choice':
                showMultipleChoice(question);
                break;
            case 'drawing':
                showDrawingQuestion(question);
                break;
            case 'drag-drop':
                showDragDropQuestion(question);
                break;
            case 'math-input':
                showMathInputQuestion(question);
                break;
        }

        // Update navigation buttons
        $('#prev-btn').toggle(currentQuestion > 1);
        $('#next-btn').toggle(currentQuestion < totalQuestions);
        $('#finish-btn').toggle(currentQuestion === totalQuestions);
    }

    function showMultipleChoice(question) {
        const answersHtml = question.answers.map(answer => `
            <div class="answer-option" data-answer-id="${answer.id}">
                ${answer.text}
            </div>
        `).join('');
        
        $('#answers').html(answersHtml);
        MathJax.typesetPromise();

        $('.answer-option').on('click', function() {
            $('.answer-option').removeClass('selected');
            $(this).addClass('selected');
            userAnswers[currentQuestion - 1] = $(this).data('answer-id');
        });
    }

    function showDrawingQuestion(question) {
        $('#drawing-canvas').show();
        const canvas = document.getElementById('drawing-canvas');
        const ctx = canvas.getContext('2d');
        
        // Add drawing tools
        const toolsHtml = `
            <div class="drawing-tools">
                <button class="tool-button" data-tool="pencil" title="Olovka">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="tool-button" data-tool="line" title="Linija">
                    <i class="fas fa-minus"></i>
                </button>
                <button class="tool-button" data-tool="rectangle" title="Pravokutnik">
                    <i class="fas fa-square"></i>
                </button>
                <button class="tool-button" data-tool="circle" title="Kružnica">
                    <i class="fas fa-circle"></i>
                </button>
                <button class="tool-button" data-tool="eraser" title="Gumica">
                    <i class="fas fa-eraser"></i>
                </button>
                <button class="tool-button" data-tool="clear" title="Očisti sve">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        $(canvas).before(toolsHtml);
        
        // Initialize drawing functionality
        initDrawing(canvas, ctx);
    }

    function showDragDropQuestion(question) {
        const { items, zones } = question;
        
        const dragDropHtml = `
            <div class="drag-drop-container">
                <div class="items-container">
                    ${items.map(item => `
                        <div class="draggable" draggable="true" data-item="${item}">
                            ${item}
                        </div>
                    `).join('')}
                </div>
                <div class="zones-container">
                    ${zones.map(zone => `
                        <div class="dropzone" data-zone="${zone.id}">
                            <h4>${zone.label}</h4>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        $('#interactive-area').show().html(dragDropHtml);
        initDragAndDrop();
    }

    function showMathInputQuestion(question) {
        const mathInputHtml = `
            <div class="math-input-container">
                <input type="text" class="math-input" placeholder="Upiši matematički izraz...">
                <div class="math-preview"></div>
            </div>
        `;
        
        $('#interactive-area').show().html(mathInputHtml);
        
        $('.math-input').on('input', function() {
            const input = $(this).val();
            $('.math-preview').html(`\\[${input}\\]`);
            MathJax.typesetPromise();
            userAnswers[currentQuestion - 1] = input;
        });
    }

    function initDrawing(canvas, ctx) {
        let isDrawing = false;
        let tool = 'pencil';
        let startX, startY;
        
        $('.tool-button').on('click', function() {
            tool = $(this).data('tool');
            $('.tool-button').removeClass('active');
            $(this).addClass('active');
            
            if(tool === 'clear') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        function startDrawing(e) {
            isDrawing = true;
            [startX, startY] = [e.offsetX, e.offsetY];
        }
        
        function draw(e) {
            if (!isDrawing) return;
            
            const x = e.offsetX;
            const y = e.offsetY;
            
            ctx.beginPath();
            
            switch(tool) {
                case 'pencil':
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    [startX, startY] = [x, y];
                    break;
                    
                case 'line':
                    ctx.putImageData(savedImageData, 0, 0);
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    break;
                    
                case 'rectangle':
                    ctx.putImageData(savedImageData, 0, 0);
                    ctx.strokeRect(startX, startY, x - startX, y - startY);
                    break;
                    
                case 'circle':
                    ctx.putImageData(savedImageData, 0, 0);
                    const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                    break;
                    
                case 'eraser':
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 20;
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1;
                    [startX, startY] = [x, y];
                    break;
            }
        }
        
        function stopDrawing() {
            isDrawing = false;
            savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        
        // Save initial canvas state
        let savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function initDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const dropzones = document.querySelectorAll('.dropzone');
        
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });
            
            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                // Save answer
                const answer = {};
                dropzones.forEach(zone => {
                    const zoneId = zone.dataset.zone;
                    const items = Array.from(zone.querySelectorAll('.draggable'))
                        .map(item => item.dataset.item);
                    answer[zoneId] = items;
                });
                userAnswers[currentQuestion - 1] = answer;
            });
        });
        
        dropzones.forEach(zone => {
            zone.addEventListener('dragover', e => {
                e.preventDefault();
                zone.classList.add('active');
            });
            
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('active');
            });
            
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('active');
                const draggable = document.querySelector('.dragging');
                zone.appendChild(draggable);
            });
        });
    }

    $('#next-btn').on('click', function() {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            updateAssessmentUI();
        }
    });

    $('#prev-btn').on('click', function() {
        if (currentQuestion > 1) {
            currentQuestion--;
            updateAssessmentUI();
        }
    });

    $('#finish-btn').on('click', function() {
        if (confirm('Jeste li sigurni da želite završiti provjeru?')) {
            showResults();
        }
    });

    function showResults() {
        const score = calculateScore();
        const masteryLevel = calculateMasteryLevel();
        const recommendations = generateRecommendations(masteryLevel);

        const scoreHtml = `
            <h3>Ukupni rezultat: ${score}%</h3>
            <p>Riješili ste ${userAnswers.filter(a => a).length} od ${totalQuestions} pitanja.</p>
        `;

        const masteryHtml = `
            <h3>Razina znanja po područjima</h3>
            <div class="mastery-grid">
                ${Object.entries(masteryLevel).map(([area, level]) => `
                    <div class="mastery-item">
                        <h4>${area}</h4>
                        <div class="mastery-bar">
                            <div class="mastery-fill" style="width: ${level}%"></div>
                        </div>
                        <p>${level}%</p>
                    </div>
                `).join('')}
            </div>
        `;

        const recommendationsHtml = `
            <h3>Preporuke za daljnje učenje</h3>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;

        $('.score-summary').html(scoreHtml);
        $('.topic-mastery').html(masteryHtml);
        $('.recommendations').html(recommendationsHtml);

        $('#assessment-content').hide();
        $('#results').show();
    }

    function calculateScore() {
        const correctAnswers = userAnswers.filter((answer, index) => 
            answer === questions[index].correctAnswer
        ).length;
        return Math.round((correctAnswers / totalQuestions) * 100);
    }

    function calculateMasteryLevel() {
        // This is a mock implementation
        return {
            'Osnovni koncepti': Math.round(Math.random() * 40 + 60),
            'Primjena': Math.round(Math.random() * 40 + 40),
            'Problemski zadaci': Math.round(Math.random() * 40 + 20)
        };
    }

    function generateRecommendations(masteryLevel) {
        // This is a mock implementation
        const recommendations = [
            'Vježbajte više zadatke s primjenom koncepata',
            'Posvetite više vremena problemskim zadacima',
            'Pregledajte osnovne koncepte prije prelaska na složenije teme'
        ];
        return recommendations;
    }

    $('#retry-topic-btn').on('click', function() {
        $('#results').hide();
        startAssessment();
    });

    $('#new-topic-btn').on('click', function() {
        $('#results').hide();
        showTopicSelection();
    });

    $('#restart-btn').on('click', function() {
        $('#results').hide();
        $('#grade-selection').show();
        resetAssessment();
    });

    function resetAssessment() {
        currentGrade = null;
        currentTopic = null;
        currentQuestion = 1;
        userAnswers = [];
        questions = [];
    }
});
