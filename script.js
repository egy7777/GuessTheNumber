class NumberGuessingGame {
    constructor() {
        this.minNumber = 1;
        this.maxNumber = 100;
        this.secretNumber = null;
        this.attempts = 0;
        this.gameStarted = false;

        // DOM Elements
        this.rangeSetup = document.getElementById('range-setup');
        this.gamePlay = document.getElementById('game-play');
        this.minInput = document.getElementById('min-number');
        this.maxInput = document.getElementById('max-number');
        this.startButton = document.getElementById('start-game');
        this.guessInput = document.getElementById('guess-input');
        this.guessButton = document.getElementById('guess-btn');
        this.messageElement = document.getElementById('message');
        this.attemptsElement = document.getElementById('attempts');
        this.newGameButton = document.getElementById('new-game');
        this.victorySound = document.getElementById('victory-sound');

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.guessButton.addEventListener('click', () => this.checkGuess());
        this.newGameButton.addEventListener('click', () => this.resetGame());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkGuess();
        });
    }

    startGame() {
        const min = parseInt(this.minInput.value);
        const max = parseInt(this.maxInput.value);

        if (isNaN(min) || isNaN(max)) {
            this.showMessage('Please enter valid numbers', 'error');
            return;
        }

        if (min >= max) {
            this.showMessage('Maximum number must be greater than minimum number', 'error');
            return;
        }

        this.minNumber = min;
        this.maxNumber = max;
        this.secretNumber = this.generateRandomNumber(min, max);
        this.attempts = 0;
        this.gameStarted = true;

        this.updateUI();
        this.showMessage(`I'm thinking of a number between ${min} and ${max}`, 'info');
    }

    checkGuess() {
        if (!this.gameStarted) return;

        const guess = parseInt(this.guessInput.value);
        
        if (isNaN(guess)) {
            this.showMessage('Please enter a valid number', 'error');
            this.guessInput.classList.add('shake');
            setTimeout(() => this.guessInput.classList.remove('shake'), 300);
            return;
        }

        if (guess < this.minNumber || guess > this.maxNumber) {
            this.showMessage(`Please enter a number between ${this.minNumber} and ${this.maxNumber}`, 'error');
            return;
        }

        this.attempts++;
        this.attemptsElement.textContent = this.attempts;

        if (guess === this.secretNumber) {
            this.showMessage(`Congratulations! You guessed the number in ${this.attempts} attempts!`, 'success');
            this.gameStarted = false;
            this.playVictoryAnimation();
        } else if (guess < this.secretNumber) {
            this.showMessage('Too low! Try again.', 'info');
        } else {
            this.showMessage('Too high! Try again.', 'info');
        }

        this.guessInput.value = '';
        this.guessInput.focus();
    }

    playVictoryAnimation() {
        // Play victory sound
        this.victorySound.currentTime = 0;
        this.victorySound.play();

        // Confetti animation
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Confetti from the left
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            
            // Confetti from the right
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    resetGame() {
        this.gameStarted = false;
        this.attempts = 0;
        this.attemptsElement.textContent = this.attempts;
        this.messageElement.textContent = '';
        this.guessInput.value = '';
        this.updateUI();
    }

    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = 'message';
        this.messageElement.classList.add(type);
    }

    updateUI() {
        if (this.gameStarted) {
            this.rangeSetup.classList.add('hidden');
            this.gamePlay.classList.remove('hidden');
        } else {
            this.rangeSetup.classList.remove('hidden');
            this.gamePlay.classList.add('hidden');
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
}); 