class NumberLineGame {
    constructor() {
        this.score = 0;
        this.currentTask = null;
        this.maxNumber = 20;
        this.currentPosition = 0;
        this.targetPosition = 0;
        this.isAddition = true;
        
        // Canvas postavke
        this.canvas = document.getElementById('numberLine');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // DOM elementi
        this.taskElement = document.getElementById('task');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.newTaskButton = document.getElementById('newTask');
        this.hintButton = document.getElementById('hint');
        this.toggleOperationButton = document.getElementById('toggleOperation');
        this.printTasksButton = document.getElementById('printTasks');
        this.userInput = document.getElementById('userInput');
        this.submitAnswerButton = document.getElementById('submitAnswer');
        this.stepForwardButton = document.getElementById('stepForward');
        this.stepBackwardButton = document.getElementById('stepBackward');

        // Event listeneri
        this.newTaskButton.addEventListener('click', () => this.generateNewTask());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.toggleOperationButton.addEventListener('click', () => this.toggleOperation());
        this.printTasksButton.addEventListener('click', () => this.printTasks());
        this.submitAnswerButton.addEventListener('click', () => this.checkUserInput());
        this.stepForwardButton.addEventListener('click', () => this.step(1));
        this.stepBackwardButton.addEventListener('click', () => this.step(-1));
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkUserInput();
        });

        // Inicijalno generiranje zadatka
        this.generateNewTask();
    }

    setupCanvas() {
        // Postavi stvarnu veličinu canvasa
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Izračunaj dimenzije za brojevnu liniju
        this.lineY = this.canvas.height / 2;
        this.startX = 50;
        this.endX = this.canvas.width - 50;
        this.stepWidth = (this.endX - this.startX) / this.maxNumber;

        // Odmah nacrtaj brojevnu liniju
        this.drawNumberLine();
        
        // Dodaj listener za promjenu veličine
        window.addEventListener('resize', () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.lineY = this.canvas.height / 2;
            this.startX = 50;
            this.endX = this.canvas.width - 50;
            this.stepWidth = (this.endX - this.startX) / this.maxNumber;
            this.drawNumberLine();
        });
    }

    drawNumberLine() {
        // Očisti canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Nacrtaj glavnu liniju
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.lineY);
        this.ctx.lineTo(this.endX, this.lineY);
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Nacrtaj oznake i brojeve
        for (let i = 0; i <= this.maxNumber; i++) {
            const x = this.startX + (i * this.stepWidth);
            
            // Nacrtaj oznaku
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.lineY - 10);
            this.ctx.lineTo(x, this.lineY + 10);
            this.ctx.stroke();

            // Dodaj broj
            this.ctx.font = '16px Comic Neue';
            this.ctx.fillStyle = '#333333';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(i.toString(), x, this.lineY + 30);
        }

        // Označi trenutnu poziciju
        if (this.currentPosition !== null) {
            const x = this.startX + (this.currentPosition * this.stepWidth);
            this.ctx.beginPath();
            this.ctx.arc(x, this.lineY, 15, 0, Math.PI * 2);
            this.ctx.fillStyle = '#e91e63';
            this.ctx.fill();
        }
    }

    drawArrow(fromX, toX, color = '#FF6B6B') {
        const ctx = this.ctx;
        const lineY = this.lineY;
        const direction = fromX < toX ? 1 : -1;
        const distance = Math.abs(toX - fromX);
        
        // Parametri za luk
        const arcHeight = Math.min(40, distance * 0.3);
        const controlY = lineY - arcHeight;

        // Animacija
        let progress = 0;
        const animate = () => {
            if (progress >= 1) return;
            
            // Očisti prethodno stanje
            this.redrawNumberLine();
            
            progress += 0.03;
            
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            
            // Crtaj luk do trenutne pozicije
            const currentToX = fromX + (toX - fromX) * progress;
            
            // Kvadratna Bezier krivulja
            ctx.beginPath();
            ctx.moveTo(fromX, lineY);
            ctx.quadraticCurveTo(
                (fromX + currentToX) / 2, 
                controlY,
                currentToX, 
                lineY
            );
            ctx.stroke();
            
            // Crtaj strelicu na kraju
            if (progress > 0.9) {
                const arrowSize = 10;
                const angle = Math.atan2(
                    lineY - controlY,
                    currentToX - ((fromX + currentToX) / 2)
                );
                
                ctx.beginPath();
                ctx.moveTo(currentToX, lineY);
                ctx.lineTo(
                    currentToX - arrowSize * Math.cos(angle - Math.PI / 6),
                    lineY - arrowSize * Math.sin(angle - Math.PI / 6)
                );
                ctx.moveTo(currentToX, lineY);
                ctx.lineTo(
                    currentToX - arrowSize * Math.cos(angle + Math.PI / 6),
                    lineY - arrowSize * Math.sin(angle + Math.PI / 6)
                );
                ctx.stroke();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    showStep(step) {
        const startX = this.getXForNumber(step.from);
        const endX = this.getXForNumber(step.to);
        
        this.drawArrow(startX, endX);
    }

    redrawNumberLine() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawNumberLine();
    }

    getXForNumber(number) {
        return this.startX + (number * this.stepWidth);
    }

    generateNewTask() {
        let start, step;
        
        if (this.isAddition) {
            start = Math.floor(Math.random() * 15) + 1;
            step = Math.floor(Math.random() * (20 - start)) + 1;
        } else {
            start = Math.floor(Math.random() * 11) + 10;
            step = Math.floor(Math.random() * Math.min(start, 10)) + 1;
        }

        this.currentTask = { start, step };
        this.currentPosition = start;
        this.targetPosition = this.isAddition ? start + step : start - step;

        // Postavi tekst zadatka
        this.taskElement.textContent = this.isAddition 
            ? `${start} + ${step} = ?` 
            : `${start} - ${step} = ?`;

        // Očisti input i feedback
        this.userInput.value = '';
        this.feedbackElement.classList.add('hidden');

        // Nacrtaj brojevnu liniju s novom pozicijom
        this.drawNumberLine();
    }

    step(direction) {
        const newPosition = this.currentPosition + direction;
        if (newPosition >= 0 && newPosition <= this.maxNumber) {
            this.currentPosition = newPosition;
            this.drawNumberLine();
        }
    }

    checkUserInput() {
        if (this.userInput.value === '') return;
        
        const userAnswer = parseInt(this.userInput.value);
        this.checkAnswer(userAnswer);
    }

    checkAnswer(userAnswer) {
        const correct = userAnswer === this.targetPosition;
        this.showFeedback(correct);
        
        if (correct) {
            this.score += 1;
            this.scoreElement.textContent = this.score;
            
            // Animiraj score
            this.scoreElement.classList.add('pop');
            setTimeout(() => this.scoreElement.classList.remove('pop'), 300);

            // Prikaži strelicu do točnog odgovora
            this.showStep({ from: this.currentTask.start, to: this.targetPosition });

            // Generiraj novi zadatak nakon kratke pauze
            setTimeout(() => {
                this.currentPosition = this.targetPosition;
                this.generateNewTask();
            }, 1500);
        }
    }

    showFeedback(correct) {
        this.feedbackElement.textContent = correct ? 'Točno! 🎉' : 'Pokušaj ponovno! 💪';
        this.feedbackElement.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
        this.feedbackElement.classList.remove('hidden');
    }

    showHint() {
        const { start, step } = this.currentTask;
        
        let hintText = 'Pokušaj ovako:\n';
        if (this.isAddition) {
            hintText += `1. Kreni od broja ${start}\n`;
            hintText += `2. Pomakni se ${step} mjesta udesno\n`;
            hintText += `3. Broj na kojem završiš je rješenje!`;
        } else {
            hintText += `1. Kreni od broja ${start}\n`;
            hintText += `2. Pomakni se ${step} mjesta ulijevo\n`;
            hintText += `3. Broj na kojem završiš je rješenje!`;
        }
        
        this.feedbackElement.textContent = hintText;
        this.feedbackElement.className = 'feedback hint';
        this.feedbackElement.classList.remove('hidden');
    }

    toggleOperation() {
        this.isAddition = !this.isAddition;
        this.toggleOperationButton.textContent = this.isAddition ? 'Prijeđi na oduzimanje' : 'Prijeđi na zbrajanje';
        this.generateNewTask();
    }

    printTasks() {
        // Create a new window for printing
        const printWindow = window.open('', '', 'width=800,height=600,top=50,left=50,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
        
        // Generiraj print sadržaj
        let printContent = `
            <html>
            <head>
                <title>Vježbe s brojevnom linijom</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        margin: 0;
                    }
                    .print-task { 
                        font-size: 16pt; 
                        margin: 30px 0;
                        page-break-inside: avoid;
                        clear: both;
                    }
                    .number-line {
                        width: 100%;
                        height: 100px;
                        margin: 10px 0;
                        display: block;
                        border: 1px solid #ccc;
                    }
                    h2 { 
                        font-size: 20pt; 
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .task-text {
                        margin-bottom: 15px;
                    }
                    .solution-line {
                        border-bottom: 1px solid #000;
                        display: inline-block;
                        width: 50px;
                        margin: 0 5px;
                    }
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                </style>
            </head>
            <body>
                <h2>Vježbe s brojevnom linijom do 20</h2>
                <div style="text-align: center; margin-bottom: 30px;">
                    Ime i prezime: ________________________________<br>
                    Datum: ________________
                </div>
        `;

        // Generiraj 10 zadataka
        for (let i = 1; i <= 10; i++) {
            const isAdd = Math.random() < 0.5;
            let num1, num2;
            
            if (isAdd) {
                num1 = Math.floor(Math.random() * 15) + 1;
                num2 = Math.floor(Math.random() * (20 - num1)) + 1;
                printContent += `
                    <div class="print-task">
                        <div class="task-text">${i}. Izračunaj pomoću brojevne linije:</div>
                        ${num1} + ${num2} = <span class="solution-line"></span>
                        <canvas class="number-line" width="800" height="100"></canvas>
                    </div>
                `;
            } else {
                num1 = Math.floor(Math.random() * 11) + 10;
                num2 = Math.floor(Math.random() * Math.min(num1, 10)) + 1;
                printContent += `
                    <div class="print-task">
                        <div class="task-text">${i}. Izračunaj pomoću brojevne linije:</div>
                        ${num1} - ${num2} = <span class="solution-line"></span>
                        <canvas class="number-line" width="800" height="100"></canvas>
                    </div>
                `;
            }
        }

        printContent += `
            </body>
            </html>
        `;

        // Set the content of the new window
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for the content to load
        printWindow.onload = () => {
            // Draw number lines on all canvases
            const canvases = printWindow.document.querySelectorAll('.number-line');
            canvases.forEach(canvas => {
                const ctx = canvas.getContext('2d');
                this.drawPrintNumberLine(ctx);
            });

            // Wait a bit for canvases to render then print
            setTimeout(() => {
                // Postavi event listenere za zatvaranje prozora
                printWindow.onafterprint = () => {
                    printWindow.close();
                };
                
                // Dodaj listener za odustajanje od printa (kad se print dijalog zatvori bez printanja)
                let printDialogClosed = false;
                
                const checkPrintDialog = setInterval(() => {
                    if (!printDialogClosed && !printWindow.document.hasFocus()) {
                        printDialogClosed = true;
                        setTimeout(() => {
                            if (!printWindow.closed) {
                                printWindow.close();
                            }
                        }, 500);
                    }
                }, 100);

                // Pokreni print dijalog
                printWindow.print();
                
                // Očisti interval nakon 10 sekundi (za svaki slučaj)
                setTimeout(() => {
                    clearInterval(checkPrintDialog);
                }, 10000);
            }, 500);
        };
    }

    drawPrintNumberLine(ctx) {
        const lineY = 50;
        const startX = 30;
        const endX = 770;
        const stepWidth = (endX - startX) / 20;

        // Očisti canvas prije crtanja
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Nacrtaj glavnu liniju
        ctx.beginPath();
        ctx.moveTo(startX, lineY);
        ctx.lineTo(endX, lineY);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nacrtaj oznake i brojeve
        for (let i = 0; i <= 20; i++) {
            const x = startX + (i * stepWidth);
            
            // Nacrtaj oznaku
            ctx.beginPath();
            ctx.moveTo(x, lineY - 10);
            ctx.lineTo(x, lineY + 10);
            ctx.stroke();

            // Dodaj broj
            ctx.font = '14px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.fillText(i.toString(), x, lineY + 25);
        }
    }

    initializeGame() {
        // Ponovno dohvati sve DOM elemente
        this.canvas = document.getElementById('numberLine');
        this.ctx = this.canvas.getContext('2d');
        this.taskElement = document.getElementById('task');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.newTaskButton = document.getElementById('newTask');
        this.hintButton = document.getElementById('hint');
        this.toggleOperationButton = document.getElementById('toggleOperation');
        this.printTasksButton = document.getElementById('printTasks');
        this.userInput = document.getElementById('userInput');
        this.submitAnswerButton = document.getElementById('submitAnswer');
        this.stepForwardButton = document.getElementById('stepForward');
        this.stepBackwardButton = document.getElementById('stepBackward');

        // Ponovno postavi event listenere
        this.newTaskButton.addEventListener('click', () => this.generateNewTask());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.toggleOperationButton.addEventListener('click', () => this.toggleOperation());
        this.printTasksButton.addEventListener('click', () => this.printTasks());
        this.submitAnswerButton.addEventListener('click', () => this.checkUserInput());
        this.stepForwardButton.addEventListener('click', () => this.step(1));
        this.stepBackwardButton.addEventListener('click', () => this.step(-1));
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkUserInput();
        });

        // Postavi canvas i generiraj novi zadatak
        this.setupCanvas();
        this.generateNewTask();
    }
}

// Pokreni igru
const game = new NumberLineGame();
