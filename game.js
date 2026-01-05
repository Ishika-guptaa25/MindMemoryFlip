const CARD_SYMBOLS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎲', '🎰', '🏀', '⚽', '🎾', '🏐', '🏈', '⚾', '🎳', '🏓', '🏸', '🥊'];

const DIFFICULTY_LEVELS = {
    easy: { pairs: 6, time: 60, name: 'Easy' },
    medium: { pairs: 10, time: 90, name: 'Medium' },
    hard: { pairs: 16, time: 120, name: 'Hard' }
};

class FlipMindGame {
    constructor() {
        this.difficulty = 'medium';
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.timeLeft = 0;
        this.gameActive = false;
        this.timer = null;
        this.bestScores = this.loadBestScores();

        this.initializeElements();
        this.attachEventListeners();
        this.initializeGame();
    }

    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.timerDisplay = document.getElementById('timer');
        this.movesDisplay = document.getElementById('moves');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.winMessage = document.getElementById('win-message');
        this.loseMessage = document.getElementById('lose-message');
        this.winText = document.getElementById('win-text');
        this.finalScore = document.getElementById('final-score');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    }

    attachEventListeners() {
        this.resetBtn.addEventListener('click', () => this.resetGame());

        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.level;
                this.initializeGame();
            });
        });
    }

    initializeGame() {
        this.clearTimer();
        const config = DIFFICULTY_LEVELS[this.difficulty];

        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.timeLeft = config.time;
        this.gameActive = false;

        this.updateDisplay();
        this.createCards(config.pairs);
        this.hideMessages();
    }

    createCards(pairs) {
        const symbols = CARD_SYMBOLS.slice(0, pairs);
        const cardPairs = [...symbols, ...symbols];
        this.cards = this.shuffleArray(cardPairs).map((symbol, index) => ({
            id: index,
            symbol: symbol,
            matched: false
        }));

        this.gameBoard.innerHTML = '';
        this.gameBoard.className = this.difficulty;

        this.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            this.gameBoard.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.id = card.id;

        cardDiv.innerHTML = `
            <div class="card-face card-back">
                <div class="card-back-inner"></div>
            </div>
            <div class="card-face card-front">${card.symbol}</div>
        `;

        cardDiv.addEventListener('click', () => this.handleCardClick(card.id));

        return cardDiv;
    }

    handleCardClick(cardId) {
        if (!this.gameActive && this.moves === 0) {
            this.startGame();
        }

        const cardElement = document.querySelector(`[data-id="${cardId}"]`);

        if (this.flippedCards.length >= 2 ||
            this.flippedCards.includes(cardId) ||
            this.matchedCards.includes(cardId)) {
            return;
        }

        cardElement.classList.add('flipped');
        this.flippedCards.push(cardId);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [firstId, secondId] = this.flippedCards;
        const firstCard = this.cards.find(c => c.id === firstId);
        const secondCard = this.cards.find(c => c.id === secondId);

        if (firstCard.symbol === secondCard.symbol) {
            setTimeout(() => {
                this.matchedCards.push(firstId, secondId);
                document.querySelector(`[data-id="${firstId}"]`).classList.add('matched');
                document.querySelector(`[data-id="${secondId}"]`).classList.add('matched');
                this.flippedCards = [];
                this.checkWin();
            }, 500);
        } else {
            setTimeout(() => {
                document.querySelector(`[data-id="${firstId}"]`).classList.remove('flipped');
                document.querySelector(`[data-id="${secondId}"]`).classList.remove('flipped');
                this.flippedCards = [];
            }, 1000);
        }
    }

    checkWin() {
        if (this.matchedCards.length === this.cards.length) {
            this.gameActive = false;
            this.clearTimer();
            this.showWinMessage();
            this.updateBestScore();
        }
    }

    startGame() {
        this.gameActive = true;
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.gameActive = false;
                this.clearTimer();
                this.showLoseMessage();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (this.timeLeft <= 10) {
            this.timerDisplay.classList.add('warning');
        } else {
            this.timerDisplay.classList.remove('warning');
        }

        this.movesDisplay.textContent = this.moves;

        const bestScore = this.bestScores[this.difficulty];
        this.bestScoreDisplay.textContent = bestScore !== null ? bestScore : '-';
    }

    calculateScore() {
        const config = DIFFICULTY_LEVELS[this.difficulty];
        return this.moves + (config.time - this.timeLeft);
    }

    updateBestScore() {
        const score = this.calculateScore();
        const currentBest = this.bestScores[this.difficulty];

        if (currentBest === null || score < currentBest) {
            this.bestScores[this.difficulty] = score;
            this.saveBestScores();
            this.bestScoreDisplay.textContent = score;
        }
    }

    loadBestScores() {
        const stored = localStorage.getItem('flipmind-scores');
        return stored ? JSON.parse(stored) : { easy: null, medium: null, hard: null };
    }

    saveBestScores() {
        localStorage.setItem('flipmind-scores', JSON.stringify(this.bestScores));
    }

    showWinMessage() {
        const score = this.calculateScore();
        this.winText.textContent = `You completed the game in ${this.moves} moves with ${this.timeLeft} seconds remaining!`;
        this.finalScore.textContent = `Final Score: ${score}`;
        this.winMessage.classList.remove('hidden');
    }

    showLoseMessage() {
        this.loseMessage.classList.remove('hidden');
    }

    hideMessages() {
        this.winMessage.classList.add('hidden');
        this.loseMessage.classList.add('hidden');
    }

    resetGame() {
        this.initializeGame();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlipMindGame();
});