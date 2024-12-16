// Provjeri je li skripta učitana
console.log('Crtanje linije script loaded');

// Pričekaj da se DOM učita
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    // Provjeri jesu li svi potrebni elementi dostupni
    const canvas = document.getElementById('drawingCanvas');
    console.log('Canvas element:', canvas);
    
    if (!canvas) {
        console.error('Canvas element not found! Aborting game initialization.');
        return;
    }

    // Provjeri dimenzije canvasa
    const rect = canvas.getBoundingClientRect();
    console.log('Canvas dimensions:', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
    });

    // Provjeri kontekst
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context! Aborting game initialization.');
        return;
    }
    console.log('Canvas context:', ctx);

    // Provjeri ostale elemente
    const elements = {
        newTask: document.getElementById('newTask'),
        checkLine: document.getElementById('checkLine'),
        clearCanvas: document.getElementById('clearCanvas'),
        hint: document.getElementById('hint'),
        toggleSound: document.getElementById('toggleSound'),
        printTasks: document.getElementById('printTasks'),
        score: document.getElementById('score'),
        timer: document.querySelector('#timer span')
    };

    // Provjeri jesu li svi elementi pronađeni
    const missingElements = Object.entries(elements)
        .filter(([name, element]) => !element)
        .map(([name]) => name);

    if (missingElements.length > 0) {
        console.error('Missing elements:', missingElements);
        return;
    }

    console.log('All elements found:', elements);

    // Inicijaliziraj igru
    try {
        console.log('Creating game instance...');
        const game = new DrawingGame();
        console.log('Game instance created successfully');
    } catch (error) {
        console.error('Error creating game instance:', error);
    }
});

class DrawingGame {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.level = 1;
        this.isDrawing = false;
        this.startPoint = null;
        this.endPoint = null;
        this.baseLine = null;
        this.userLine = null;
        this.difficulty = 'easy';
        this.soundEnabled = true;
        this.timeLeft = 30;
        this.timerInterval = null;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.loadHighScore();
        this.generateNewTask();
        this.startTimer();
    }

    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.redrawCanvas();
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        document.getElementById('newTask').addEventListener('click', () => this.generateNewTask());
        document.getElementById('checkLine').addEventListener('click', () => this.checkAnswer());
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearUserLine());
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        document.getElementById('toggleSound').addEventListener('click', () => this.toggleSound());
        document.getElementById('printTasks').addEventListener('click', () => this.printTasks());
    }

    loadHighScore() {
        const highScoreElement = document.getElementById('highScore');
        highScoreElement.textContent = this.highScore;
    }

    generateNewTask() {
        // Očisti prethodni timer ako postoji
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Postavi vrijeme prema težini
        switch(this.difficulty) {
            case 'easy': this.timeLeft = 30; break;
            case 'medium': this.timeLeft = 20; break;
            case 'hard': this.timeLeft = 15; break;
        }
        
        // Generiraj kontrolne točke za zakrivljenu liniju
        const margin = this.difficulty === 'hard' ? 30 : 50;
        const x1 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const y1 = margin + Math.random() * (this.canvas.height - 2 * margin);
        const x2 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const y2 = margin + Math.random() * (this.canvas.height - 2 * margin);
        
        // Kontrolne točke za zakrivljenost
        const cx1 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const cy1 = margin + Math.random() * (this.canvas.height - 2 * margin);
        const cx2 = margin + Math.random() * (this.canvas.width - 2 * margin);
        const cy2 = margin + Math.random() * (this.canvas.height - 2 * margin);

        this.baseLine = { x1, y1, x2, y2, cx1, cy1, cx2, cy2 };
        this.generatePoints();
        this.userLine = null;
        this.redrawCanvas();
        this.startTimer();
    }

    generatePoints() {
        const margin = this.difficulty === 'hard' ? 30 : 50;
        let attempts = 0;
        const maxAttempts = 100;

        do {
            const x1 = margin + Math.random() * (this.canvas.width - 2 * margin);
            const y1 = margin + Math.random() * (this.canvas.height - 2 * margin);
            const x2 = margin + Math.random() * (this.canvas.width - 2 * margin);
            const y2 = margin + Math.random() * (this.canvas.height - 2 * margin);

            this.startPoint = { x: x1, y: y1 };
            this.endPoint = { x: x2, y: y2 };

            if (this.doLinesIntersect(
                this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y,
                this.baseLine.x1, this.baseLine.y1, this.baseLine.x2, this.baseLine.y2
            )) {
                break;
            }

            attempts++;
        } while (attempts < maxAttempts);
    }

    startDrawing(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isNearPoint(x, y, this.startPoint)) {
            this.isDrawing = true;
            this.userLine = {
                x1: this.startPoint.x,
                y1: this.startPoint.y,
                x2: this.startPoint.x,
                y2: this.startPoint.y
            };
        }
    }

    draw(e) {
        if (!this.isDrawing || !this.userLine) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.userLine.x2 = x;
        this.userLine.y2 = y;
        this.redrawCanvas();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Nacrtaj zakrivljenu baznu liniju
        this.ctx.beginPath();
        this.ctx.moveTo(this.baseLine.x1, this.baseLine.y1);
        this.ctx.bezierCurveTo(
            this.baseLine.cx1, this.baseLine.cy1,
            this.baseLine.cx2, this.baseLine.cy2,
            this.baseLine.x2, this.baseLine.y2
        );
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Nacrtaj točke
        if (this.startPoint) {
            this.drawPoint(this.startPoint, '#e74c3c', 8);
        }
        if (this.endPoint) {
            this.drawPoint(this.endPoint, '#e74c3c', 8);
        }
        
        // Nacrtaj korisnikovu liniju
        if (this.userLine) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.userLine.x1, this.userLine.y1);
            this.ctx.lineTo(this.userLine.x2, this.userLine.y2);
            this.ctx.strokeStyle = '#3498db';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    drawPoint(point, color, size = 5) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        // Dodaj obrub
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    isNearPoint(x, y, point, threshold = 20) {
        if (!point) return false;
        const dx = x - point.x;
        const dy = y - point.y;
        return Math.sqrt(dx * dx + dy * dy) < threshold;
    }

    doLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denominator = ((x2 - x1) * (y4 - y3)) - ((y2 - y1) * (x4 - x3));
        if (denominator === 0) return false;

        const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
        const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;

        return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
    }

    checkAnswer() {
        if (!this.userLine) {
            this.showFeedback('Prvo nacrtaj liniju!', false);
            return;
        }

        const isCorrect = this.doLinesIntersect(
            this.userLine.x1, this.userLine.y1, this.userLine.x2, this.userLine.y2,
            this.baseLine.x1, this.baseLine.y1, this.baseLine.x2, this.baseLine.y2
        );
        
        if (isCorrect) {
            this.score += this.difficulty === 'hard' ? 3 : (this.difficulty === 'medium' ? 2 : 1);
            this.updateScore();
            this.showFeedback('Točno! Bravo!', true);
            this.playSound('correct');
            this.generateNewTask();
        } else {
            this.showFeedback('Pokušaj ponovno!', false);
            this.playSound('wrong');
        }
    }

    showFeedback(message, isSuccess) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${isSuccess ? 'success' : 'error'}`;
        feedback.classList.remove('hidden');
        
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 2000);
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            document.getElementById('highScore').textContent = this.highScore;
            this.playSound('levelUp');
        }
    }

    resetTimer() {
        this.timeLeft = this.difficulty === 'hard' ? 15 : (this.difficulty === 'medium' ? 20 : 30);
        document.querySelector('#timer span').textContent = this.timeLeft;
        this.startTimer();
    }

    showHint() {
        this.showFeedback('Pokušaj povezati označene točke!', true);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundButton = document.getElementById('toggleSound');
        soundButton.textContent = this.soundEnabled ? '🔊 Zvuk' : '🔇 Zvuk';
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        const sound = document.getElementById(type + 'Sound');
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.error('Error playing sound:', error);
            });
        }
    }

    clearUserLine() {
        this.userLine = null;
        this.redrawCanvas();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.querySelector('#timer span').textContent = this.timeLeft;
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.showFeedback('Vrijeme je isteklo!', false);
                this.generateNewTask();
            }
        }, 1000);
    }

    printTasks() {
        // Kreiraj popup prozor s posebnim parametrima
        const printWindow = window.open('', '', 'width=800,height=600,top=50,left=50,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
        
        if (!printWindow) {
            alert('Molimo omogućite pop-up prozore za ovu stranicu.');
            return;
        }

        // Pripremi sadržaj za print
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Zadaci za vježbu - Crtanje ravnih linija</title>
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
                        margin-bottom: 30px;
                        padding: 15px;
                        border: 1px solid #ddd;
                    }
                    canvas {
                        max-width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                <h1>Zadaci za vježbu - Crtanje ravnih linija</h1>
                ${this.taskHistory.map((task, index) => `
                    <div class="print-task">
                        <h2>Zadatak ${index + 1}</h2>
                        <p>${task.description}</p>
                        <img src="${task.image}" alt="Zadatak ${index + 1}">
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        // Zapiši sadržaj u print prozor
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Postavi detekciju zatvaranja print dijaloga
        let printDialogClosed = false;
        const checkPrintDialog = setInterval(() => {
            if (!printDialogClosed && !printWindow.document.hasFocus()) {
                printWindow.close();
                clearInterval(checkPrintDialog);
            }
        }, 100);

        // Čekaj da se sadržaj učita prije pokretanja printa
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };

        // Očisti interval nakon 10 sekundi
        setTimeout(() => {
            clearInterval(checkPrintDialog);
        }, 10000);
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.resetTimer();
    }
}

// Pokreni igru
window.addEventListener('load', () => {
    const game = new DrawingGame();
});
