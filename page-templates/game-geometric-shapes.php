<?php
/*
Template Name: Geometrijski Oblici Igra
*/
get_header();
wp_enqueue_script('jquery');

// Provjera je li korisnik prijavljen
$current_user = wp_get_current_user();
$username = $current_user->display_name ? $current_user->display_name : 'Gost';
?>

<div id="gameContainer">
    <h1>Prepoznaj Geometrijski Oblik</h1>
    <canvas id="shapeCanvas" width="300" height="200"></canvas>
    
    <div id="buttons">
        <button id="triangleBtn" class="button">Trokut</button>
        <button id="squareBtn" class="button">Kvadrat</button>
        <button id="circleBtn" class="button">Krug</button>
        <button id="rectangleBtn" class="button">Pravokutnik</button>
        <button id="hexagonBtn" class="button">Šesterokut</button>
        <button id="starBtn" class="button">Zvijezda</button>
    </div>

    <div id="gameStats">
        <div id="timer">Preostalo vremena: <span id="timeLeft">60</span> sekundi</div>
        <div id="score">Bodovi: <span id="scoreValue">0</span></div>
    </div>

    <div id="lastGameResult" class="last-game-result"></div>

    <div id="feedbackMessage" class="feedback"></div>

    <div id="gameControls">
        <button id="newGameBtn" class="button new-game">Nova Igra</button>
        <button id="printTasksBtn" class="button print-tasks">Isprintaj Zadatke</button>
    </div>

    <div id="printableTasksContainer" style="display:none; position:absolute; left:0; top:0; width:100%;">
        <div style="padding:20px; background:white;">
            <h1 style="text-align:center; color:black !important;">Geometrijski Oblici</h1>
            <div style="margin:20px; color:black !important;">
                <div id="taskList" style="column-count: 5; column-gap: 10px;"></div>
            </div>
        </div>
    </div>
</div>

<style>
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: 'Comic Sans MS', cursive;
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    }
    #gameContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
    }
    h1 {
        margin-bottom: 20px;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    #shapeCanvas {
        border: 4px dashed #4CAF50;
        margin: 10px 0;
        background-color: rgba(255,255,255,0.9);
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    #buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-bottom: 10px;
    }
    .button {
        flex: 0 1 calc(33% - 10px);
        margin: 5px;
        padding: 10px 15px;
        font-size: 14px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        font-weight: bold;
        border: none;
        color: white;
    }
    #triangleBtn { background-color: #FF6B6B; }
    #squareBtn { background-color: #4ECDC4; }
    #circleBtn { background-color: #45B7D1; }
    #rectangleBtn { background-color: #FDCB6E; }
    #hexagonBtn { background-color: #6C5CE7; }
    #starBtn { background-color: #FF9FF3; }
    .button:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    #gameStats {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 300px;
        color: white;
        font-weight: bold;
    }
    #gameControls {
        margin-top: 15px;
    }
    .new-game {
        background-color: #2ecc71;
        color: white;
        padding: 10px 20px;
        font-size: 16px;
    }
    .new-game:hover {
        background-color: #27ae60;
    }
    .feedback {
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
        color: white;
        height: 30px;
    }
    .feedback.correct {
        color: #2ecc71;
    }
    .feedback.incorrect {
        color: #e74c3c;
    }
    .last-game-result {
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }
    .print-tasks {
        background-color: #3498db;
        margin-left: 10px;
    }
    .print-tasks:hover {
        background-color: #2980b9;
    }
    
    /* Stilovi za printanje */
    @media print {
        body * {
            visibility: hidden !important;
        }
        #printableTasksContainer, #printableTasksContainer * {
            visibility: visible !important;
            display: block !important;
        }
        #printableTasksContainer {
            display: block !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            z-index: 9999 !important;
        }
        canvas {
            border: 2px solid black !important;
        }
    }
    @media print {
        body * {
            visibility: hidden;
        }
        #printableTasksContainer, #printableTasksContainer * {
            visibility: visible;
        }
        #printableTasksContainer {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
        .printable-tasks {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .printable-tasks h1 {
            text-align: center;
            border-bottom: 2px solid black;
            padding-bottom: 10px;
        }
        .task-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .task-canvas {
            border: 1px solid black;
            margin: 10px 0;
            width: 200px;
            height: 200px;
        }
    }
</style>

<script>
    const canvas = document.getElementById('shapeCanvas');
    const ctx = canvas.getContext('2d');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const lastGameResult = document.getElementById('lastGameResult');
    const printTasksBtn = document.getElementById('printTasksBtn');
    const username = '<?php echo esc_js($username); ?>';
    let currentShape = '';
    let score = 0;
    let timeLeft = 60;
    let timerInterval;
    let gameEnded = false;

    function drawTriangle(ctx) {
        ctx.beginPath();
        ctx.moveTo(100, 20);
        ctx.lineTo(20, 180);
        ctx.lineTo(180, 180);
        ctx.closePath();
        ctx.stroke();
    }

    function drawSquare(ctx) {
        ctx.beginPath();
        ctx.rect(40, 40, 120, 120);
        ctx.stroke();
    }

    function drawCircle(ctx) {
        ctx.beginPath();
        ctx.arc(100, 100, 80, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function drawRectangle(ctx) {
        ctx.beginPath();
        ctx.rect(40, 60, 120, 80);
        ctx.stroke();
    }

    function drawHexagon(ctx) {
        ctx.beginPath();
        const centerX = 100, centerY = 100, size = 80;
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function drawStar(ctx) {
        ctx.beginPath();
        const centerX = 100, centerY = 100, outerRadius = 80, innerRadius = 40;
        const numPoints = 5;
        for (let i = 0; i < numPoints * 2; i++) {
            const angle = (Math.PI / 2 + i * Math.PI / numPoints);
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function generatePrintableTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        const shapes = [
            { name: 'trokut', drawFunc: drawTriangle },
            { name: 'kvadrat', drawFunc: drawSquare },
            { name: 'krug', drawFunc: drawCircle },
            { name: 'pravokutnik', drawFunc: drawRectangle },
            { name: 'šesterokut', drawFunc: drawHexagon },
            { name: 'zvijezda', drawFunc: drawStar }
        ];

        for (let i = 0; i < 10; i++) {
            const taskDiv = document.createElement('div');
            taskDiv.style.cssText = 'break-inside: avoid; margin-bottom: 10px; text-align: center;';

            const taskCanvas = document.createElement('canvas');
            taskCanvas.width = 100;
            taskCanvas.height = 100;
            taskCanvas.style.cssText = 'border: 1px solid black; margin: 2px auto; display: block;';
            taskDiv.appendChild(taskCanvas);

            const taskContext = taskCanvas.getContext('2d');
            taskContext.fillStyle = 'white';
            taskContext.fillRect(0, 0, taskCanvas.width, taskCanvas.height);
            taskContext.strokeStyle = 'black';
            taskContext.lineWidth = 2;

            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            taskContext.save();
            taskContext.translate(50, 50);
            taskContext.scale(0.5, 0.5);
            taskContext.translate(-100, -100);
            randomShape.drawFunc(taskContext);
            taskContext.restore();

            taskList.appendChild(taskDiv);
        }
    }

    function drawTriangleGame() {
        ctx.beginPath();
        ctx.moveTo(150, 30);
        ctx.lineTo(50, 170);
        ctx.lineTo(250, 170);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2c3e50';
        ctx.stroke();
        currentShape = 'triangle';
    }

    function drawSquareGame() {
        ctx.beginPath();
        ctx.rect(75, 50, 150, 150);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2c3e50';
        ctx.stroke();
        currentShape = 'square';
    }

    function drawCircleGame() {
        ctx.beginPath();
        ctx.arc(150, 100, 75, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2c3e50';
        ctx.stroke();
        currentShape = 'circle';
    }

    function drawRectangleGame() {
        ctx.beginPath();
        ctx.rect(75, 75, 150, 75);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2c3e50';
        ctx.stroke();
        currentShape = 'rectangle';
    }

    function drawHexagonGame() {
        ctx.beginPath();
        const centerX = 150, centerY = 100, size = 75;
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2c3e50';
        ctx.stroke();
        currentShape = 'hexagon';
    }

    function drawStarGame() {
        ctx.beginPath();
        const centerX = 150, centerY = 100, outerRadius = 75, innerRadius = 35;
        const numPoints = 5;
        for (let i = 0; i < numPoints * 2; i++) {
            const angle = (Math.PI / 2 + i * Math.PI / numPoints);
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2c3e50';
        ctx.stroke();
        currentShape = 'star';
    }

    function generateShape() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const shapes = [drawTriangleGame, drawSquareGame, drawCircleGame, drawRectangleGame, drawHexagonGame, drawStarGame];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        randomShape();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 60;
        document.getElementById('timeLeft').textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timeLeft').textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function showFeedback(message, isCorrect) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        setTimeout(() => {
            feedbackMessage.textContent = '';
            feedbackMessage.className = 'feedback';
        }, 2000);
    }

    function endGame() {
        clearInterval(timerInterval);
        gameEnded = true;
        
        // Slanje rezultata na server
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=save_game_score&username=${encodeURIComponent(username)}&score=${score}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                lastGameResult.textContent = `Zadnji rezultat: ${score} bodova`;
                showFeedback(`Igra je završena! Vaš rezultat ${score} je spremljen.`, false);
            } else {
                lastGameResult.textContent = `Zadnji rezultat: ${score} bodova`;
                showFeedback(`Igra je završena! Vaš rezultat ${score}.`, false);
            }
        })
        .catch(error => {
            console.error('Greška:', error);
            lastGameResult.textContent = `Zadnji rezultat: ${score} bodova`;
            showFeedback(`Igra je završena! Vaš rezultat ${score}.`, false);
        });
    }

    function resetGame() {
        // Ako je prethodna igra završila, resetiraj sve
        if (gameEnded) {
            score = 0;
            gameEnded = false;
            lastGameResult.textContent = ''; // Briši prethodni rezultat
        }
        
        document.getElementById('scoreValue').textContent = score;
        startTimer();
        generateShape();
        showFeedback('Nova igra započela!', true);
    }

    function checkAnswer(selectedShape) {
        console.log('Trenutni oblik:', currentShape, 'Odabrani oblik:', selectedShape);
        if (selectedShape === currentShape) {
            score++;
            document.getElementById('scoreValue').textContent = score;
            showFeedback('Točno! Odabrani oblik je ispravan.', true);
            generateShape();
        } else {
            showFeedback('Netočno! Pokušaj ponovno.', false);
        }
    }

    document.getElementById('triangleBtn').addEventListener('click', () => checkAnswer('triangle'));
    document.getElementById('squareBtn').addEventListener('click', () => checkAnswer('square'));
    document.getElementById('circleBtn').addEventListener('click', () => checkAnswer('circle'));
    document.getElementById('rectangleBtn').addEventListener('click', () => checkAnswer('rectangle'));
    document.getElementById('hexagonBtn').addEventListener('click', () => checkAnswer('hexagon'));
    document.getElementById('starBtn').addEventListener('click', () => checkAnswer('star'));

    document.getElementById('newGameBtn').addEventListener('click', resetGame);

    printTasksBtn.addEventListener('click', function() {
        generatePrintableTasks();
        document.getElementById('printableTasksContainer').style.display = 'block';
        setTimeout(function() {
            window.print();
            document.getElementById('printableTasksContainer').style.display = 'none';
        }, 100);
    });

    generateShape();
    startTimer();
</script>

<?php get_footer(); ?>
